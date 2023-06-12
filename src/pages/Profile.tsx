import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Grid,
  useBreakpointValue,
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
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { setPageStatus, setProfilePosts } from "../redux/slice/HomePage";
import Navbar from "../nav/Navbar";
import RightSidebar from "../nav/RightSidebar";

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
      isProfile: true,
      isFollower: false,
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
  const q = query(
    postsRef,
    where("userId", "==", uuid)
  );
  const getPosts = () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        ...(doc.data() as Posts),
        id: doc.id,
      }));
      posts.sort((a, b) => {
        const dateA = new Date(
          a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000
        );
        const dateB = new Date(
          b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000
        );
        return dateB.getTime() - dateA.getTime();
      });
      setPosts(posts);
      dispatch(setProfilePosts(posts));
    });
  };
  const columnValues = useBreakpointValue({
    base: "100%",
    sm: "10% auto 24%",
    md: "30vw auto",
    lg: "18vw auto 34vw",
  });
  useEffect(() => {
    getPosts();
  }, [uuid, db]);
  if (profile === undefined) {
    return <Loader />;
  }
  return (
    <>
      <Navbar />
      <Grid
        gridTemplateColumns={columnValues}
        columnGap="2rem"
        marginLeft="1rem"
        marginRight="1rem"
      >
        <RightSidebar />
        <Feed />
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
      </Grid>
    </>
  );
};

export default Profile;
