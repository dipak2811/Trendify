import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Feed, { Posts } from "../components/Feed";
import ProfileSidebar from "../components/ProfileSidebar";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  getFirestore,
  DocumentData,
  collection,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { app } from "../firebase";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { setPageStatus } from "../redux/slice/HomePage";

const Profile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<DocumentData | undefined>(undefined);
  useEffect(() => {
    document.title = `Trendify - ${profile?.username}`;
  }, [profile?.username]);
  useEffect(() => {
    const pageStatus = {
      isExplore: false,
      isLibrary: false,
      isYourPosts: false,
      isSearch: false,
      isProfile: false,
      isFollower: true,
    };

    dispatch(setPageStatus(pageStatus));
  }, []);
  const { uuid } = useParams();
  const db = getFirestore(app);
  const toast = useToast();
  const getProfile = async () => {
    const userPosts = await getDoc(doc(collection(db, "users"), uuid));
    if (userPosts.exists()) {
      setProfile(userPosts.data());
    } else {
      toast({
        title: "Error",
        description: "No user found :(",
        status: "error",
        duration: 6900,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    getProfile();
  }, [uuid, db]);
  const [posts, setPosts] = useState<Posts[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isMobileView] = useMediaQuery("(max-width: 48em)");
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", uuid));
  const getPosts = () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        ...(doc.data() as Posts),
        id: doc.id,
      }));
      setPosts(posts);
    });
  };

  useEffect(() => {
    getPosts();
  }, [uuid, db]);
  if (profile === undefined) {
    return <Loader />;
  }
  return (
    <div>
      <Feed username={profile?.username} profilePosts={posts} />
      {isMobileView ? (
        <>
          <Button
            pos={"absolute"}
            right="0"
            top={"7rem"}
            zIndex="100"
            ref={btnRef}
            colorScheme="teal"
            onClick={onOpen}
            padding={0}
            background="#D6BCFA"
          > 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="m-0 p-0"
              width="100%"
              height="100%"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <ProfileSidebar
                username={profile?.username}
                bio={profile?.bio}
                createdAt={profile?.createdAt}
                pfp={profile?.pfp}
                uid={profile?.uid}
                postsLength={posts?.length}
              />
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <ProfileSidebar
          username={profile?.username}
          bio={profile?.bio}
          createdAt={profile?.createdAt}
          pfp={profile?.pfp}
          uid={profile?.uid}
          postsLength={posts?.length}
        />
      )}
    </div>
  );
};

export default Profile;
