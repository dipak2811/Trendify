import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  limit,
} from "firebase/firestore";
import { app } from "../firebase";
import Loader from "../components/Loader";
import { setExplorePosts, setPageStatus } from "../redux/slice/HomePage";

const Explore = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<any[]>([]);
  const db = getFirestore(app);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, limit(5));
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
    document.title = "Explore";

    getPosts();
    const pageStatus = {
      isExplore: true,
      isLibrary: false,
      isYourPosts: false,
      isSearch: false,
      isProfile: false,
      isFollower: false,
    };

    dispatch(setPageStatus(pageStatus));
    dispatch(setExplorePosts(posts));
  }, []);
  if (posts?.length === 0) {
    return <Loader />;
  }
  return (
    <div>
      <Feed />
    </div>
  );
};

export default Explore;
