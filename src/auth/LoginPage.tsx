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
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const auth: Auth = getAuth(app);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError((error as Error).message);
      toast({
        title: "Error",
        description: (error as Error).message,
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
    } catch (error) {
      setError((error as Error).message as string);
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      bgImage="url('https://img.freepik.com/premium-photo/abstract-white-design-background-with-smooth-wavy-lines_476363-6179.jpg')"
      bgSize="cover"
      bgPosition="center"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        width="400px"
        p={4}
        mx="auto"
        // mt={10}
        borderWidth={1}
        borderRadius="md"
        borderColor="black"
        color="black"
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
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="lg"
                onClick={toggleShowPassword}
                variant="ghost"
                _focus={{ boxShadow: "none" }}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
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
    </Box>
  );
};

export default LoginPage;
