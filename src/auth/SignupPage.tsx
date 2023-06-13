import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  Auth,
} from "firebase/auth";
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  setDoc,
  doc,
  getFirestore,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const auth: Auth = getAuth(app);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (
      !email ||
      !password ||
      !username ||
      !bio ||
      !profileImage ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character"
      );
      return;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError("Email is already registered");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      const storageRef = ref(
        storage,
        `profile-images/${user.uid}/${profileImage.name}`
      );
      await uploadBytes(storageRef, profileImage);
      const imageUrl = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: imageUrl });

      await setDoc(doc(db, "users", user?.uid), {
        username: user?.displayName,
        bio: bio.trim(),
        uid: user?.uid,
        pfp: user?.photoURL,
        email: user?.email,
      });

      navigate("/login");
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

  const handleProfileImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setProfileImage(file);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkEmailExists = async (email: string) => {
    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const emailSnapshot = await getDocs(emailQuery);
    return !emailSnapshot.empty;
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
        mt={10}
        borderWidth={1}
        borderRadius="md"
        borderColor="black"
        color="Black"
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
            border="none"
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
        <FormControl id="bio" mt={4} isRequired>
          <FormLabel>Bio</FormLabel>
          <Input
            type="text"
            placeholder="Enter your bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.trimStart())}
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
        <FormControl id="confirmPassword" mt={4} isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="lg"
                onClick={toggleShowConfirmPassword}
                variant="ghost"
                _focus={{ boxShadow: "none" }}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
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
    </Box>
  );
};

export default SignupPage;
