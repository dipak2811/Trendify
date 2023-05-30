import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import {
  collection,
  onSnapshot,
  getFirestore,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setFollowersData, setPageStatus } from "../redux/slice/HomePage";

const Followers = () => {
  const dispatch = useDispatch();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [followers, setFollowers] = useState<any>();
  useEffect(() => {
    document.title = "Followers";
    const pageStatus = {
      isExplore: false,
      isLibrary: false,
      isYourPosts: false,
      isSearch: false,
      isProfile: false,
      isFollower: true,
    };

    dispatch(setPageStatus(pageStatus));
    dispatch(setFollowersData(followers));
  }, []);
  const userRef = collection(
    db,
    "users",
    auth?.currentUser?.uid as string,
    "followers"
  );
  const getFollowers = async () => {
    onSnapshot(userRef, (snapshot) => {
      const followers = snapshot?.docs?.map((doc) => ({
        ...doc.data(),
      }));
      setFollowers(followers);
    });
  };
  useEffect(() => {
    getFollowers();
  }, [db, auth?.currentUser?.uid]);
  return (
    <div>
      <Feed />
    </div>
  );
};

export default Followers;
