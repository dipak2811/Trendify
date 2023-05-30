import React from "react";
import {
  Flex,
  Heading,
  Tooltip,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { MdExplore, MdPhotoLibrary } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoMdCreate, IoMdImages } from "react-icons/io";
import { RiUserFollowFill } from "react-icons/ri";

const RightSidebar = () => {
  const navigate = useNavigate();

  const [isMobileOrTablet] = useMediaQuery("(max-width: 30em)");
  return (
    <Flex
      position={isMobileOrTablet ? "unset" : "sticky"}
      top="8rem"
      height="max-content"
      flexDirection="column"
    >
      <Flex
        borderRadius="1rem"
        boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
        marginTop="2rem"
        width="100%"
        flexDirection="column"
      >
        {window.location.pathname === "/" ? (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            borderTopRightRadius="1rem"
            borderTopLeftRadius="1rem"
            backgroundColor= "#cfcfcf57"
            onClick={() => {
              navigate("/");
            }}
          >
            <FaHome
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Home
            </Heading>
          </Flex>
        ) : (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            borderTopLeftRadius="1rem"
            _hover={{
              backgroundColor: "#cfcfcf57",
            }}
            borderTopRightRadius="1rem"
            onClick={() => {
              navigate("/");
            }}
          >
            <FaHome
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Home
            </Heading>
          </Flex>
        )}
        {window.location.pathname === "/explore" ? (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            backgroundColor= "#cfcfcf57"
            onClick={() => {
              navigate("/explore");
            }}
          >
            <MdExplore
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Explore
            </Heading>
          </Flex>
        ) : (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            _hover={{
              backgroundColor: "#cfcfcf57",
            }}
            onClick={() => {
              navigate("/explore");
            }}
          >
            <MdExplore
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Explore
            </Heading>
          </Flex>
        )}
        {window.location.pathname === "/library" ? (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            backgroundColor= "#cfcfcf57"
            onClick={() => {
              navigate("/library");
            }}
          >
            <MdPhotoLibrary
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Library
            </Heading>
          </Flex>
        ) : (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            _hover={{
              backgroundColor: "#cfcfcf57",
            }}
            onClick={() => {
              navigate("/library");
            }}
          >
            <MdPhotoLibrary
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Library
            </Heading>
          </Flex>
        )}
        {window.location.pathname === "/your_posts" ? (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            backgroundColor= "#cfcfcf57"
            onClick={() => {
              navigate("/your_posts");
            }}
          >
            <IoMdImages
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Your posts
            </Heading>
          </Flex>
        ) : (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            _hover={{
              backgroundColor: "#cfcfcf57",
            }}
            onClick={() => {
              navigate("/your_posts");
            }}
          >
            <IoMdImages
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Your posts
            </Heading>
          </Flex>
        )}
        {window.location.pathname === "/followers" ? (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            backgroundColor= "#cfcfcf57"
            onClick={() => {
              navigate("/followers");
            }}
          >
            <RiUserFollowFill
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Followers
            </Heading>
          </Flex>
        ) : (
          <Flex
            alignItems="center"
            cursor="pointer"
            height="4rem"
            transition="all 300ms ease"
            gap="1rem"
            _hover={{
              backgroundColor: "#cfcfcf57",
            }}
            onClick={() => {
              navigate("/followers");
            }}
          >
            <RiUserFollowFill
              size="1.4rem"
              style={{
                marginLeft: "1rem",
              }}
            />
            <Heading as="h5" size="md">
              Followers
            </Heading>
          </Flex>
        )}
      </Flex>
      <Tooltip openDelay={400} label="Create shit">
        <Button
          leftIcon={<IoMdCreate />}
          backgroundColor="#ACBCFF"
          variant="solid"
          marginTop="2rem"
          onClick={() => {
            navigate("/create");
          }}
        >
          Create
        </Button>
      </Tooltip>
    </Flex>
  );
};

export default RightSidebar;
