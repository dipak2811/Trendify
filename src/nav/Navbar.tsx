import React, { useState } from "react";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  CloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { ImSearch } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";

const Navbar = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const toast = useToast();
  const auth = getAuth(app);

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

  return (
    <Flex
      justifyContent={isMobile ? "" : "space-between"}
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
          <MenuItem gap="0.7rem" onClick={logout}>
            <IoLogOut size="1.4rem" />
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Navbar;
