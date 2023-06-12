import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  where
} from "firebase/firestore";
import { app } from "../firebase";
import { setPageStatus, setPosts } from "../redux/slice/HomePage";
import { Posts } from "../components/Feed";
import { getAuth } from "firebase/auth";
import { Follower } from "./Followers";
const Home = () => {
  const dispatch = useDispatch();
  const [followersposts, setFollowersPosts] = useState<Posts[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const getFollowersPosts = (userId: string) => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const getPosts = () => {
      onSnapshot(q, (snapshot) => {
        const newPosts = snapshot?.docs?.map((doc) => ({
          ...(doc.data() as Posts),
          id: doc.id,
        }));
        setFollowersPosts((prev) => [...prev, ...newPosts]);
      });
    };
    getPosts();
  };
useEffect(()=>{
  followersposts.sort((a, b) => {
    const dateA = new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000);
    const dateB = new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000);
    return dateB.getTime() - dateA.getTime();
  });
  dispatch(setPosts(followersposts))
},[followersposts])
  useEffect(() => {
    followers.forEach((element) => {
      getFollowersPosts(element.id);
    });
  }, [followers]);
  useEffect(() => {
    document.title = "Trendify";
    const pageStatus = {
      isExplore: false,
      isLibrary: false,
      isYourPosts: false,
      isProfile: false,
      isFollower: false,
    };
    dispatch(setPageStatus(pageStatus));
    const userRef = collection(
      db,
      "users",
      auth?.currentUser?.uid as string,
      "followers"
    );

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const followers = snapshot.docs.map((doc) => ({
        id: doc.id,
      })) as Follower[];
      setFollowers(followers);
    });

    return () => {
      unsubscribe();
    };
  }, [db, auth?.currentUser?.uid]);
  console.log(followersposts, "Home");

  return (
    <div>
      <Feed />
    </div>
  );
};

export default Home;
