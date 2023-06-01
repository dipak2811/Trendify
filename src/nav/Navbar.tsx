import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  CloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useToast,
  Alert,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { ImSearch } from "react-icons/im";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { getAuth, signOut, updateProfile } from "firebase/auth";
// import { useAuth } from "../contexts/AuthContext";
// import { updateProfile } from "../services/authService";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { IoLogOut } from "react-icons/io5";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  // const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newProfilePic, setNewProfilePic] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const storage = getStorage(app);
  const toast = useToast();
  const navigate = useNavigate();
  const db = getFirestore(app);

  const onClose = () => {
    setIsOpen(false);
    setNewPassword("");
    setNewProfilePic("");
    setNewBio("");
    setNewEmail("");
    setError("");
  };
  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.message,
          status: "error",
          duration: 6900,
          isClosable: true,
        });
      });
  };
  const handleUploadProfilePic = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not found");
      }

      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const file = files[0];

      const storageRef = ref(
        storage,
        `profile-images/${user.uid}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: imageUrl });

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
  const handleIconButtonClick = () => {
    const inputElement = document.getElementById("profile-pic-upload");
    if (inputElement) {
      inputElement.click();
    }
  };
  const handleProfileUpdate = async () => {
    const user = auth.currentUser;
    setError("");
    setUpdateLoading(true);

    try {
      //@ts-ignore
      await setDoc(doc(db, "users", user?.uid), {
        username: user?.displayName,
        bio: newBio.trim(),
        uid: user?.uid,
        pfp: user?.photoURL,
        email: user?.email,
      });
      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      setError((error as Error).message);
    }

    setUpdateLoading(false);
  };

  return (
    <Flex
      justifyContent={isMobile ? "space-around" : "space-between"}
      alignItems="center"
      p={isMobile ? 2 : 4}
      position="sticky"
      top={0}
      zIndex="100"
      backgroundColor="#B799FF"
    >
      <Flex>
        <Heading
          color="white"
          size={isMobile ? "sm" : "xl"}
          fontFamily="Sansita Swashed"
        >
          Trendify
        </Heading>
      </Flex>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch("");
          navigate("/search/" + search);
        }}
      >
        <Tooltip openDelay={400}>
          <InputGroup mx={isMobile ? 2 : 8} width={isMobile ? "40vw" : "50vw"}>
            <InputLeftElement
              pointerEvents="none"
              children={<ImSearch color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Search Post"
              variant="filled"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              _focus={{ bg: "white" }}
            />
            {search?.length > 0 ? (
              <CloseButton size="lg" onClick={() => setSearch("")} />
            ) : null}
          </InputGroup>
        </Tooltip>
      </form>
      <Menu>
        <MenuButton>
          <Tooltip label={auth?.currentUser?.displayName} openDelay={400}>
            <Avatar
              cursor="pointer"
              src={auth?.currentUser?.photoURL as string | undefined}
            />
          </Tooltip>
        </MenuButton>
        <MenuList>
          <MenuItem
            gap="0.7rem"
            onClick={() => {
              navigate(`/profile/${auth?.currentUser?.uid}`);
            }}
          >
            <FaUserCircle size="1.4rem" />
            Your profile
          </MenuItem>
          <MenuItem gap="0.7rem" onClick={() => setIsOpen(true)}>
            <BiEdit size={20} /> Edit profile
          </MenuItem>
          <MenuItem gap="0.7rem" onClick={logout}>
            <IoLogOut size="1.4rem" />
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Alert status="error">{error}</Alert>}
            <Flex mb={4}>
              {newProfilePic ? (
                <Avatar size="xl" src={newProfilePic} />
              ) : (
                <Avatar size="xl" src={auth.currentUser?.photoURL ?? ""} />
              )}
              <Box ml={4}>
                <Tooltip label="Change Profile Picture">
                  <div>
                    <IconButton
                      as="span"
                      icon={<FaCamera />}
                      variant="ghost"
                      size="sm"
                      aria-label="Upload Profile Picture"
                      onClick={handleIconButtonClick}
                    />
                    <Input
                      id="profile-pic-upload"
                      display="none"
                      type="file"
                      accept="image/*"
                      onChange={handleUploadProfilePic}
                    />
                  </div>
                </Tooltip>
              </Box>
            </Flex>
            <InputGroup size="sm" mb={4}>
              <InputLeftElement
                pointerEvents="none"
                children={<BiEdit color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="Bio"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
            </InputGroup>
            <InputGroup size="sm" mb={4}>
              <InputLeftElement
                pointerEvents="none"
                children={<BiEdit color="gray.300" />}
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup size="sm" mb={4}>
              <InputLeftElement
                pointerEvents="none"
                children={<BiEdit color="gray.300" />}
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              isLoading={updateLoading}
              onClick={handleProfileUpdate}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Navbar;
