import React from "react";
import { Avatar, Flex, Heading, Tooltip } from "@chakra-ui/react";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IUser } from "../pages/Search";
import { HomePageState } from "../redux/slice/HomePage";

export type Posts = {
  caption: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  image: string;
  userName: string;
  userId: string;
  id: string;
};

interface State {
  pageDetails: HomePageState;
}
const Feed = () => {
  const pageDetail = useSelector((state: State) => state);
  const allData = pageDetail.pageDetails;
  const pageStatus = allData?.pageStatus;
  const pagePosts = allData?.posts;
  const libraryPosts = allData?.libraryPosts;
  const profilePosts = allData?.profilePosts;
  const followersData = allData?.followersData;
  const explorePosts = allData?.explorePosts;
  const yourPosts = allData?.yourPosts;

  const navigate = useNavigate();
  return pageStatus?.isExplore ? (
    <Flex
      marginTop={5}
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Trending posts
      </Heading>
      {explorePosts.map((post: Posts, index: number) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  ) : pageStatus?.isLibrary ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      marginTop={5}
      height="max-content"
    >
      <Heading as="h4" size="md">
        Saved posts
      </Heading>
      {libraryPosts?.map((post: Posts, index: number) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  ) : pageStatus?.isYourPosts ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      marginTop={5}
      height="max-content"
    >
      <Heading as="h4" size="md">
        Your posts
      </Heading>
      {yourPosts?.map((post: Posts, index: number) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  ) : pageStatus?.isProfile ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      marginTop="2rem"
      height="max-content"
    >
      {profilePosts.length === 0 ? (
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          flexDirection="column"
          gap="1rem"
        >
          <Heading as="h4" size="md" color="gray.500">
            Nothing is Posted
          </Heading>
        </Flex>
      ) : (
        profilePosts.map((post: Posts, index: number) => (
          <Post key={index} posts={post} />
        ))
      )}
    </Flex>
  ) : pageStatus?.isFollower ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Flex gap="2rem" alignItems="center" flexWrap="wrap" marginBottom="1rem">
        {followersData?.map((user: IUser, index: number) => (
          <Tooltip label={user?.username} openDelay={400} key={index}>
            <Avatar
              width="16"
              height="16"
              cursor="pointer"
              src={user?.pfp}
              onClick={() => {
                navigate(`/profile/${user?.uid}`);
              }}
            />
          </Tooltip>
        ))}
      </Flex>
      <Heading as="h4" size="md" mb={2}>
        Your followers
      </Heading>
    </Flex>
  ) : (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      marginTop={5}
      height="max-content"
    >
      {pagePosts?.map((post: Posts, index: number) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  );
};

export default Feed;
