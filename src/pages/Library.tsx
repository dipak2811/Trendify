import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { setPageStatus, setLibraryPosts } from "../redux/slice/HomePage";
import { useDispatch } from "react-redux";
import { Posts } from "../components/Feed";
const Library = () => {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    document.title = "Library";
    const pageStatus = {
      isExplore: false,
      isLibrary: true,
      isYourPosts: false,
      isProfile: false,
      isFollower: false,
    };

    dispatch(setPageStatus(pageStatus));
  }, []);

  const [posts, setPosts] = useState<Posts[]>([]);

  const postsRef = collection(
    db,
    "users",
    auth?.currentUser?.uid as string,
    "savedposts"
  );

  const q = query(postsRef, orderBy("createdAt", "desc"));

  const getPosts = async () => {
    onSnapshot(q, (snapshot) => {
      const posts: Posts[] = snapshot?.docs?.map((doc) => ({
        ...(doc.data() as Posts),
        id: doc.id,
      }));
      setPosts(posts);
      dispatch(setLibraryPosts(posts));
    });
  };

  useEffect(() => {
    getPosts();
  }, [db, auth?.currentUser?.uid]);

  return (
    <div>
      <Feed />
    </div>
  );
};

export default Library;
