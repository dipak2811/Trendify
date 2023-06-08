import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Feed, { Posts } from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  limit,
  Unsubscribe,
} from "firebase/firestore";
import { app } from "../firebase";
import Loader from "../components/Loader";
import { setExplorePosts, setPageStatus } from "../redux/slice/HomePage";

const Explore = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<Posts[]>([]);
  const db = getFirestore(app);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, limit(5));

  useEffect(() => {
    document.title = "Explore";

    const unsubscribe: Unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts: Posts[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Posts),
        id: doc.id,
      }));
      setPosts(newPosts);
      dispatch(setExplorePosts(newPosts));
    });

    const pageStatus = {
      isExplore: true,
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

  if (posts.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <Feed />
    </div>
  );
};

export default Explore;
