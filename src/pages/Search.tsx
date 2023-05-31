import { Grid, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../nav/Navbar";
import RightSidebar from "../nav/RightSidebar";
import Feed, { Posts } from "../components/Feed";
import LeftSidebar from "../nav/LeftSidebar";
import { Params, useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setPageStatus, setSearchPosts } from "../redux/slice/HomePage";

const Search = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Posts[]>([]);
  const db = getFirestore(app);
  const { caption }: Readonly<Params<string>> = useParams();
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    where("caption", ">=", caption),
    where("caption", "<=", caption + "\uf8ff")
  );

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
    dispatch(setSearchPosts(posts));
  }, [posts]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const getPosts = async () => {
      unsubscribe = onSnapshot(q, (snapshot) => {
        const posts: Posts[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Posts),
          id: doc.id,
        }));
        setPosts(posts);
      });
    };

    getPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [caption, db, q]);

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
        <Feed />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Search;
