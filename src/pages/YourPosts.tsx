import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getAuth, Unsubscribe } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setPageStatus, setYourPosts } from "../redux/slice/HomePage";
import { Posts } from "../components/Feed";

const YourPosts = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const db = getFirestore(app);
  const [posts, setPosts] = useState<Posts[]>([]);
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

  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("userId", "==", auth?.currentUser?.uid));

  const getPosts = () => {
    return onSnapshot(q, (snapshot) => {
      const posts: Posts[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Posts),
        id: doc.id,
      }));
      setPosts(posts);
    });
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    const fetchPosts = async () => {
      unsubscribe = getPosts();
    };

    fetchPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth?.currentUser?.uid, db]);

  useEffect(() => {
    dispatch(setYourPosts(posts));
  }, [posts]);

  return (
    <div>
      <Feed />
    </div>
  );
};

export default YourPosts;
