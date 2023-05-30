import { Grid, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../nav/Navbar";
import RightSidebar from "../nav/RightSidebar";
import Feed from "../components/Feed";
import LeftSidebar from "../nav/LeftSidebar";
import { Params, useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setPageStatus } from "../redux/slice/HomePage";

const Search = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Search results";

    const pageStatus = {
      isExplore: false,
      isLibrary: false,
      isYourPosts: false,
      isSearch: true,
      isProfile: false,
      isFollower: false,
    };

    dispatch(setPageStatus(pageStatus));
  }, []);
  const db = getFirestore(app);
  const { caption }: Readonly<Params<string>> = useParams();
  const [posts, setPosts] = useState<any[]>([]);
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    where("caption", ">=", caption),
    where("caption", "<=", caption + "\uf8ff")
  );
  const getPosts = async () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(posts);
    });
  };
  useEffect(() => {
    getPosts();
  }, [caption, db]);
  const columnValues = useBreakpointValue({
    base: "100%",
    sm: "10% auto 24%",
    md: "30vw auto",
    lg: "18vw auto 34vw",
  });
  return (
    <div>
      <Navbar />
      <Grid
        gridTemplateColumns={columnValues}
        columnGap="2rem"
        marginLeft="1rem"
        marginRight="1rem"
      >
        <RightSidebar />
        <Feed searchPosts={posts} />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Search;
