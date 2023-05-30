import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { setPageStatus, setPosts } from "../redux/slice/HomePage";

const Explore = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.homePage.posts);
  const db = getFirestore(app);
  const postsRef = collection(db, "posts");
  const q = query(postsRef, limit(5));

  const getPosts = async () => {
    onSnapshot(q, (snapshot) => {
      const posts = snapshot?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setPosts(posts));
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
