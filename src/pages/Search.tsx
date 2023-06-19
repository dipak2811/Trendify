import React, { useEffect, useState } from "react";
import { Params, useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  getFirestore,
  Unsubscribe,
} from "firebase/firestore";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { setSearchUsers } from "../redux/slice/HomePage";
import WhoToFollow from "../components/WhoToFollow";
import { Flex } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";

export interface IUser {
  id: string;
  pfp: string;
  uid: string;
  username: string;
}

const Search = () => {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const [users, setUsers] = useState<IUser[]>([]);
  const db = getFirestore(app);
  const { caption }: Readonly<Params<string>> = useParams();
  const usersRef = collection(db, "users");

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    const CurrentUser = auth.currentUser;
    const getUsers = async () => {
      unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const filteredUsers: IUser[] = snapshot.docs
          .map((doc) => ({
            ...(doc.data() as IUser),
            id: doc.id,
          }))
          .filter(
            (user) =>
              CurrentUser?.uid !== user.uid &&
              user.username.startsWith(caption || "")
          );

        setUsers(filteredUsers);
        dispatch(setSearchUsers(filteredUsers));
      });
    };

    getUsers();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [caption, db, dispatch]);

  return (
    <div>
      <Flex
        height="max-content"
        flexDirection="column"
        gap="1rem"
        marginTop="2rem"
      >
        {users.map((user) => (
          <Flex
            boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
            flexDirection="column"
            padding="1.5rem"
            width="100%"
          >
            <WhoToFollow
              key={user.id}
              userName={user?.username}
              userId={user?.uid}
              userPfp={user?.pfp}
            />
          </Flex>
        ))}
      </Flex>
    </div>
  );
};

export default Search;
