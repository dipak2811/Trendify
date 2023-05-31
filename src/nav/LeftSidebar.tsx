import { Divider, Flex, Heading, useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  DocumentData,
  where,
  limit,
} from "firebase/firestore";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import WhoToFollow from "../components/WhoToFollow";
import { Follower } from "../pages/Followers";

const LeftSidebar = () => {
  const auth = getAuth();
  const db = getFirestore(app);
  const [recommendedUsers, setRecommendedUsers] = useState<DocumentData[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const fetchUsers = () => {
    try {
      const qUser = query(
        collection(db, "users"),
        where("uid", "!=", auth?.currentUser?.uid),
        limit(2)
      );
      const unsubscribe = onSnapshot(qUser, (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecommendedUsers(users);
        setUsersLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      fetchUsers();
    }, 1000);
  }, [db,auth]);

  const [isMobileOrTablet] = useMediaQuery("(max-width: 48em)");

  return (
    <Flex
      position={isMobileOrTablet ? "unset" : "sticky"}
      top="8rem"
      height="max-content"
      flexDirection="column"
      gap="1rem"
    >
      <Flex
        boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
        flexDirection="column"
        padding="1.5rem"
        width="100%"
      >
        <Flex width="80%" flexDirection="column" gap="0.6rem">
          <Heading as="h4" size="lg">
            Who to follow
          </Heading>
          <Heading
            as="h4"
            size="md"
            color="blue.200"
            cursor="pointer"
            _hover={{
              textDecorationLine: "underline",
            }}
          >
            View more
          </Heading>
          <Divider />
        </Flex>
        <Flex width="100%" flexDirection="column" gap="1rem" marginTop="1rem">
          {usersLoading ? (
            <div>Loading users...</div>
          ) : (
            recommendedUsers.map((user) => (
              <WhoToFollow
                key={user.id}
                userName={user?.username}
                userId={user?.uid}
                userPfp={user?.pfp}
              />
            ))
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LeftSidebar;
