import React, { useState } from "react";
import {
  Flex,
  Heading,
  Image,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { BsImageFill } from "react-icons/bs";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const CreateComponent = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const storage = getStorage(app);
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const createPost = async () => {
    if (!image) return;

    setLoading(true);

    const storageRef = ref(storage, `/images/${image.name + Date.now()}`);
    const auth = getAuth(app);

    try {
      const snapshot = await uploadBytesResumable(storageRef, image);
      const url = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "posts"), {
        caption: caption,
        image: url,
        createdAt: serverTimestamp(),
        userId: auth?.currentUser?.uid,
        userName: auth?.currentUser?.displayName,
      });

      toast({
        title: "Success",
        description: "Post created successfully",
        status: "success",
        duration: 6900,
        isClosable: true,
      });
      setLoading(false);
      navigate("/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setLoading(false);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 6900,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection="column" gap="2rem" width="100%" height="max-content">
      <Heading as="h4" size="md">
        Caption and Image are required
      </Heading>
      <Flex flexDirection="column" gap="0.4rem" width="100%">
        <Input
          variant="filled"
          placeholder="Caption"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCaption(e.target.value);
          }}
          value={caption}
        />
        {caption.length >= 5 && caption.length <= 100 ? (
          ""
        ) : (
          <Heading as="h4" size="sm" color="gray.500">
            Caption must be between 5 to 100 characters
          </Heading>
        )}
      </Flex>
      <Flex flexDirection="column" gap="0.4rem" width="100%">
        <input
          type="file"
          accept="image/*"
          placeholder="Select post image"
          onChange={uploadImage}
        />

        {image ? (
          <Image src={URL.createObjectURL(image)} alt="" width="100%" />
        ) : (
          <>
            <Flex alignItems="center" gap="1rem">
              <BsImageFill size="50%" />
              <Heading as="h4" size="md">
                Please select an image
              </Heading>
            </Flex>
            <Heading as="h4" size="sm" color="gray.500">
              Image is required
            </Heading>
          </>
        )}
      </Flex>
      {caption.length >= 5 && caption.length <= 100 && image ? (
        <Button
          backgroundColor="#E6FFFD"
          marginBottom="1rem"
          onClick={createPost}
          isLoading={loading}
          loadingText="Creating"
        >
          Create post
        </Button>
      ) : (
        <Button backgroundColor="#ACBCFF" marginBottom="1rem" disabled>
          Create post
        </Button>
      )}
    </Flex>
  );
};

export default CreateComponent;
