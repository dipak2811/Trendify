import React, { useState } from "react";
import { Flex, Text, Image, Input, Button, useToast } from "@chakra-ui/react";
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
  const [submitted, setSubmitted] = useState(false);

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
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
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
      <Flex flexDirection="column" gap="0.4rem" width="100%" mt={3}>
        <Input
          variant="filled"
          placeholder="Enter Your Caption"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCaption(e.target.value);
          }}
          value={caption}
        />
        {submitted && (caption.length < 5 || caption.length > 100) && (
          <Text as="h4" size="sm" color="red" className="error-message">
            Caption must be between 5 to 100 characters
          </Text>
        )}
      </Flex>
      <Flex flexDirection="column" gap="0.4rem" width="100%">
        <input
          type="file"
          accept="image/*"
          placeholder="Select post image"
          onChange={uploadImage}
        />
        {submitted && !image && (
          <Text as="h4" size="sm" color="red" className="error-message">
            Image is required
          </Text>
        )}
        {image ? (
          <Image
            src={URL.createObjectURL(image)}
            alt=""
            width="70%"
            aspectRatio="16/9"
          />
        ) : null}
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
        <Button
          backgroundColor="#ACBCFF"
          marginBottom="1rem"
          onClick={() => {
            setSubmitted(true);
          }}
          disabled
        >
          Create post
        </Button>
      )}
    </Flex>
  );
};

export default CreateComponent;
