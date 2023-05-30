import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  Auth,
} from "firebase/auth";
import { app } from "../firebase";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { setDoc, doc, getFirestore } from "firebase/firestore";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const auth: Auth = getAuth(app);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      if (profileImage) {
        const storageRef = ref(
          storage,
          `profile-images/${user.uid}/${profileImage.name}`
        );
        await uploadBytes(storageRef, profileImage);
        const imageUrl = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL: imageUrl });
      }
      await setDoc(doc(db, "users", user?.uid), {
        username: user?.displayName,
        bio: "Good Person",
        uid: user?.uid,
        pfp: user?.photoURL,
        email: user?.email,
      });
      navigate("/login");
    } catch (error: any) {
      setError(error.message as string);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setProfileImage(file);
    }
  };

  return (
    <Box
      width="400px"
      p={4}
      mx="auto"
      mt={10}
      borderWidth={1}
      borderRadius="md"
    >
      <Heading as="h2" textAlign="center" mb={6}>
        Sign Up
      </Heading>
      {error && (
        <Box
          p={2}
          mb={4}
          borderWidth={1}
          borderRadius="md"
          borderColor="red.500"
          color="red.500"
          fontSize="sm"
        >
          {error}
        </Box>
      )}
      <FormControl id="profileImage" isRequired>
        <FormLabel>Profile Image</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
        />
      </FormControl>
      <FormControl id="username" mt={4} isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" mt={4} isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" mt={4} isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Flex direction="column">
        <Button colorScheme="blue" mt={6} onClick={handleSignup}>
          Sign Up
        </Button>
        <Button variant="link" mt={4} onClick={() => navigate("/login")}>
          Already have an account? Sign in
        </Button>
      </Flex>
    </Box>
  );
};

export default SignupPage;
