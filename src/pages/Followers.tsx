import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setFollowersData, setPageStatus } from "../redux/slice/HomePage";

export interface Follower {
  id: string;
  pfp: string;
  uid: string;
  username: string;
}

const Followers = () => {
  const dispatch = useDispatch();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [followers, setFollowers] = useState<Follower[]>([]);

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

    const userRef = collection(
      db,
      "users",
      auth?.currentUser?.uid as string,
      "followers"
    );

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const followers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Follower[];
      setFollowers(followers);
      dispatch(setFollowersData(followers));
    });

    return () => {
      unsubscribe();
    };
  }, [db, auth?.currentUser?.uid, dispatch]);

  console.log("followers", followers);

  return (
    <div>
      <Feed />
    </div>
  );
};

export default Followers;
