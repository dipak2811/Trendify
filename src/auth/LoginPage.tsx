import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  Auth,
} from "firebase/auth";
import { app } from "../firebase";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const auth: Auth = getAuth(app);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
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

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description:
          "An email with instructions to reset your password has been sent.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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

  const handleSignup = () => {
    navigate("/signup");
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
        Login
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
      <FormControl id="email" isRequired>
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
        <Button
          colorScheme="red"
          variant="link"
          mt={2}
          onClick={handleForgotPassword}
        >
          Forgot Password
        </Button>
        <Button colorScheme="blue" mt={3} onClick={handleLogin}>
          Login
        </Button>
        <Button
          colorScheme="green"
          variant="link"
          mt={2}
          onClick={handleSignup}
        >
          Don't have an account? Sign up
        </Button>
      </Flex>
    </Box>
  );
};

export default LoginPage;
