import {
  Avatar,
  Button,
  Flex,
  Heading,
  Image,
  Tag,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type Posts = {
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
  const pageStatus = useSelector((state: any) => state.pageStatus);
  const navigate = useNavigate();
  return pageStatus?.isExplore ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Trending posts
      </Heading>
      {props?.explorePosts?.map((post, index) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  ) : pageStatus.isLibrary ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Saved posts
      </Heading>
      {props?.libraryPosts?.map((post, index) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  ) : pageStatus?.isYourPosts ? (
    <Flex
      flexDirection="column"
      gap="1rem"
      width="100%"
      position="sticky"
      top="5.4rem"
      height="max-content"
    >
      <Heading as="h4" size="md">
        Your posts
      </Heading>
      {props?.yourPosts?.map((post, index) => (
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
      <Flex  width="30%" flexDirection="column">
      <Button
          backgroundColor="#ACBCFF"
          variant="solid"
          borderRadius={24}
          padding={3}
          marginBottom={2}
          onClick={() => {
            navigate("/home");
          }}
          size="small"
        >
          Clear Search
        </Button>
      <Heading as="h4" size="md">
        Search results
      </Heading>
      </Flex>
      {props?.searchPosts?.length === 0 ? (
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
        props?.searchPosts?.map((post, index) => (
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
      {props?.profilePosts?.length === 0 ? (
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
        props?.profilePosts?.map((post, index) => (
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
        {props?.followersData?.map((user: any, index: number) => (
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
      top="5.4rem"
      height="max-content"
    >
      <Flex gap="1rem" width="100%" flexWrap="wrap" marginTop="0.5em">
        <Tag>Gaming</Tag>
        <Tag>Programming</Tag>
        <Tag>Movies</Tag>
        <Tag>Music</Tag>
        <Tag>Anime</Tag>
      </Flex>
      {props?.homePosts?.map((post, index) => (
        <Post key={index} posts={post} />
      ))}
    </Flex>
  );
};

export default Feed;
