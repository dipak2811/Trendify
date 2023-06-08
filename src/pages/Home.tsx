import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase";
import { setPageStatus, setPosts } from "../redux/slice/HomePage";
import { Posts } from "../components/Feed";
const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Trendify";

    const db = getFirestore(app);
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts: Posts[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Posts),
        id: doc.id,
      }));
      dispatch(setPosts(posts));
    });

    const pageStatus = {
      isExplore: false,
      isLibrary: false,
      isYourPosts: false,
      isSearch: false,
      isProfile: false,
      isFollower: false,
    };

    dispatch(setPageStatus(pageStatus));

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Feed />
    </div>
  );
};

export default Home;
