import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setPageStatus } from "../redux/slice/HomePage";

const YourPosts = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const db = getFirestore(app);
  useEffect(() => {
    document.title = "Social-App - YourPosts";
    const pageStatus = {
      isExplore: false,
      isLibrary: false,
      isYourPosts: true,
      isSearch: false,
      isProfile: false,
      isFollower: false,
    };

    dispatch(setPageStatus(pageStatus));
  }, []);
  const [posts, setPosts] = useState<any[]>([]);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", auth?.currentUser?.uid));
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
  }, [auth?.currentUser?.uid, db]);
  return (
    <div>
      <Feed yourPosts={posts} />
    </div>
  );
};

export default YourPosts;
