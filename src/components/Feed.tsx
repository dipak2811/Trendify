import React from "react";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  Image,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export type Posts = {
  caption: string;
  createdAt: string;
  image: string;
  userName: string;
  userId: string;
  userPfp: string;
  id: string;
};

type Props = {
  username?: string;
  homePosts?: Array<Posts>;
  explorePosts?: Array<Posts>;
  yourPosts?: Array<Posts>;
  searchPosts?: Array<Posts>;
  libraryPosts?: Array<Posts>;
  profilePosts?: Array<Posts>;
  followersData?: any;
};

const Feed = (props: Props) => {
  const pageDetail = useSelector((state: any) => state.pageStatus);
  const pageStatus = pageDetail.pageStatus;
  const pagePosts = pageDetail.posts;
  const libraryPosts = pageDetail.libraryPosts;
  const profilePosts = pageDetail.profilePosts;
  const followersData = pageDetail.followersData;
  const searchPosts = pageDetail.searchPosts;
  const explorePosts = pageDetail.explorePosts;
  const yourPosts = pageDetail.yourPosts;

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
  ) : pageStatus.isLibrary ? (
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
      {yourPosts?.map((post: any, index: number) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  ) : pageStatus?.isSearch ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Flex display="flex" justifyContent="space-between" marginTop={5}>
        <Heading as="h4" size="md">
          Search results
        </Heading>
        <Button
          backgroundColor="tomato"
          variant="solid"
          borderRadius={5}
          padding={3}
          marginBottom={2}
          onClick={() => {
            navigate("/home");
          }}
          size="small"
        >
          Clear Search
        </Button>
      </Flex>
      {searchPosts?.length === 0 ? (
        <Flex
          width="100%"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          flexDirection="column"
          gap="1rem"
        >
          <Image
            alt=""
            src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
            width="50%"
            height="50%"
          />
          <Heading as="h4" size="md" color="gray.500">
            No search results found
          </Heading>
        </Flex>
      ) : (
        searchPosts?.map((post: Posts, index: number) => (
          <Post key={index} posts={post} />
        ))
      )}
    </Flex>
  ) : pageStatus?.isProfile ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        {props?.username} posts
      </Heading>
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
        {followersData?.map((user: any, index: number) => (
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
      <Heading as="h4" size="md">
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
