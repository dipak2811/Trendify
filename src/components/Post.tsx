import React, { memo, useEffect, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Avatar,
  IconButton,
  Image,
  Tooltip,
  Button,
  useDisclosure,
  useToast,
  Input,
  SkeletonCircle,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import {
  BiDotsVerticalRounded,
  BiCommentDetail,
  BiEdit,
  BiTrash,
} from "react-icons/bi";
import {
  BsHeart,
  BsBookmark,
  BsHeartFill,
  BsBookmarkFill,
} from "react-icons/bs";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  doc,
  deleteDoc,
  getFirestore,
  setDoc,
  collection,
  onSnapshot,
  getDoc,
  updateDoc,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import CommentSection from "./CommentSection";

type Props = {
  posts?: {
    caption: string;
    createdAt: string;
    image: string;
    userName: string;
    userId: string;
    userPfp: string;
    id: string;
  };
};

const Post = (props: Props) => {
  const {
    isOpen: isCommentOpen,
    onOpen: onCommentOpen,
    onClose: onCommentClose,
  } = useDisclosure();
  const auth = getAuth(app);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const db = getFirestore(app);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [commentsLength, setCommentsLenght] = useState(0);
  const deletePost = async () => {
    setLoading(true);
    await deleteDoc(doc(db, "posts", props?.posts?.id as string))
      .then(() => {
        setLoading(false);
        onClose();
        toast({
          title: "Success",
          description: "Post deleted succesfully",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        onClose();
        toast({
          title: "Error",
          description: err?.message,
          status: "error",
          duration: 1000,
          isClosable: true,
        });
      });
  };
  const [caption, setCaption] = useState(props?.posts?.caption as string);
  const [image, setImage] = useState<any>(props?.posts?.image);
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage(app);
  const navigate = useNavigate();
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setImage(file);
    }
  };
  const [updateLoading, setUpdateLoading] = useState(false);
  const updatePost = async () => {
    setUpdateLoading(true);
    if (image === props?.posts?.image) {
      const postsCollectionRef = collection(db, "posts");
      const postDocRef = doc(postsCollectionRef, props?.posts?.id);
      await updateDoc(postDocRef, {
        caption: caption,
        image: image,
      })
        .then(() => {
          setUpdateLoading(false);
          toast({
            title: "Success",
            description: "Post updated succesfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          onEditClose();
        })
        .catch((err) => {
          setUpdateLoading(false);
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
          onEditClose();
        });
    } else {
      const storageRef = ref(storage, `/images/${image.name + Date.now()}`);
      //@ts-ignore
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          setUpdateLoading(false);
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (url) => {
              await updateDoc(doc(collection(db, "posts"), props?.posts?.id), {
                caption: caption,
                image: url,
              })
                .then(() => {
                  setUpdateLoading(false);
                  onEditClose();
                  toast({
                    title: "Success",
                    description: "Post updated succesfully",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                  });
                })
                .catch((err) => {
                  setUpdateLoading(false);
                  onEditClose();
                  toast({
                    title: "Error",
                    description: err?.message,
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                  });
                });
            })
            .catch((err) => {
              onEditClose();
              setUpdateLoading(false);
              toast({
                title: "Error",
                description: err?.message,
                status: "error",
                duration: 1000,
                isClosable: true,
              });
            });
        }
      );
    }
  };
  const [postLoading, setPostLoading] = useState(true);
  function formatCreatedAt(createdAt: any) {
    const milliseconds =
      createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000;
    const timeElapsed = Date.now() - milliseconds;

    const minutes = Math.floor(timeElapsed / (1000 * 60));
    if (minutes < 1) {
      return "just now";
    }

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  const [likes, setLikes] = useState<QueryDocumentSnapshot[]>([]);
  useEffect(() => {
    if (props.posts?.id) {
      const unsubscribe = onSnapshot(
        collection(db, "posts", props.posts.id, "likes"),
        (snapshot: QuerySnapshot) => {
          setLikes(snapshot.docs);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [db, props.posts?.id]);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    setLiked(
      likes?.findIndex(
        (like: QueryDocumentSnapshot) => like?.id === auth?.currentUser?.uid
      ) !== -1
    );
  }, [likes]);
  const likePost = async () => {
    if (liked) {
      await deleteDoc(
        doc(
          db,
          "posts",
          props?.posts?.id as string,
          "likes",
          auth?.currentUser?.uid as string
        )
      )
        .then(() => {
          toast({
            title: "Success",
            description: "Like removed succesfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          props?.posts?.id as string,
          "likes",
          auth?.currentUser?.uid as string
        ),
        {
          username: auth?.currentUser?.displayName,
        }
      )
        .then(() => {
          toast({
            title: "Success",
            description: "Like added succesfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    }
  };
  const [saved, setSaved] = useState(false);
  const getSavedPosts = async () => {
    const savedDoc = await getDoc(
      doc(
        db,
        "users",
        auth?.currentUser?.uid as string,
        "savedposts",
        props?.posts?.id as string
      )
    );
    if (savedDoc.exists()) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  };
  useEffect(() => {
    getSavedPosts();
  }, [auth?.currentUser?.uid, props?.posts?.id, db]);
  const savePost = async () => {
    if (saved) {
      await deleteDoc(
        doc(
          db,
          "users",
          auth?.currentUser?.uid as string,
          "savedposts",
          props?.posts?.id as string
        )
      )
        .then(() => {
          setSaved(false);
          toast({
            title: "Success",
            description: "Post unsaved succesfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    } else {
      await setDoc(
        doc(
          db,
          "users",
          auth?.currentUser?.uid as string,
          "savedposts",
          props?.posts?.id as string
        ),
        {
          caption: props?.posts?.caption,
          image: props?.posts?.image,
          createdAt: props?.posts?.createdAt,
          userId: props?.posts?.userId,
          userName: props?.posts?.userName,
          // userPfp: props?.posts?.userPfp,
        }
      )
        .then(() => {
          setSaved(true);
          toast({
            title: "Success",
            description: "Post saved succesfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err?.message,
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        });
    }
  };
  const [userPfp, setUserPfp] = useState("");
  useEffect(() => {
    const userPfpRef = doc(db, "users", props?.posts?.userId as string);
    const unsubscribe = onSnapshot(userPfpRef, (snapshot) => {
      const userData = snapshot.data();
      if (userData) {
        setUserPfp(userData.pfp);
      }
    });
    const unsubscribeComments = onSnapshot(
      collection(db, "posts", props?.posts?.id as string, "comments"),
      (snapshot) => {
        const updatedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCommentsLenght(updatedComments.length);
      }
    );
    return () => {
      unsubscribe();
      unsubscribeComments();
    };
  }, [db, props?.posts?.id]);

  return (
    <Flex
      flexDirection="column"
      padding="1rem"
      width="100%"
      boxShadow="0 3px 10px rgb(0 0 0 / 0.2)"
      borderRadius="md"
      gap="1rem"
      marginBottom="0.7rem"
    >
      <Flex flexDirection="row" width="100%" alignItems="center">
        <Tooltip label={props?.posts?.userName} openDelay={200}>
          {postLoading ? (
            <SkeletonCircle borderRadius={"100%"} height="12" width="14" />
          ) : (
            <Avatar
              cursor="pointer"
              src={userPfp}
              onClick={() => {
                navigate("/profile/" + props?.posts?.userId);
              }}
            />
          )}
        </Tooltip>
        <Flex
          flexDirection="column"
          width="100%"
          marginLeft="1rem"
          gap="0.2rem"
        >
          {postLoading ? (
            <Skeleton width="20rem" height="1rem" />
          ) : (
            <Heading as="h3" size="md">
              {props?.posts?.userName}
            </Heading>
          )}
          {postLoading ? (
            <Skeleton width="15rem" height="1rem" />
          ) : (
            <Heading as="h4" size="sm" color="gray.600">
              {props?.posts?.createdAt &&
                formatCreatedAt(props.posts.createdAt)}
            </Heading>
          )}
        </Flex>
        {props?.posts?.userId === auth?.currentUser?.uid ? (
          <Menu>
            <MenuButton>
              <BiDotsVerticalRounded size="1.6rem" />
            </MenuButton>
            <MenuList>
              <MenuItem gap="0.5rem" onClick={onEditOpen}>
                <BiEdit size={20} color="#90CDF4" />
                <Heading as="h4" size="sm" color="#90CDF4">
                  Edit
                </Heading>
              </MenuItem>
              <MenuItem gap="0.5rem" onClick={onOpen}>
                <BiTrash size={20} color="red" />
                <Heading as="h4" size="sm" color="red">
                  Delete
                </Heading>
              </MenuItem>
            </MenuList>
            {/* edit modal stuff */}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex width="100%" gap="1rem" flexDirection="column">
                    <Input
                      variant="filled"
                      placeholder="Caption"
                      value={caption}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCaption(e?.target?.value);
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      placeholder="Select post image"
                      onChange={uploadImage}
                    />
                  </Flex>
                  {imageUrl ? (
                    <Image src={imageUrl} alt="" width="100%" />
                  ) : (
                    <Image src={image} alt="" width="100%" />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={onEditClose}>
                    Close
                  </Button>
                  {caption?.length >= 5 &&
                  caption?.length <= 100 &&
                  image !== "" ? (
                    <Button onClick={updatePost} isLoading={updateLoading}>
                      Update
                    </Button>
                  ) : (
                    <Button disabled>Update</Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
            {/* delete alert dialog stuff here */}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Post
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    {loading === true ? (
                      ""
                    ) : (
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      colorScheme="red"
                      onClick={deletePost}
                      ml={3}
                      isLoading={loading}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Menu>
        ) : (
          <></>
        )}
      </Flex>
      {postLoading ? <Skeleton width="100%" height="20rem" /> : ""}
      <Image
        src={props?.posts?.image}
        alt=""
        borderRadius="lg"
        onLoad={() => {
          setPostLoading(false);
        }}
        aspectRatio="16/9"
      />
      {postLoading ? (
        <Skeleton height="1rem" width="24rem" />
      ) : (
        <Heading as="h5" size="sm">
          {props?.posts?.caption}
        </Heading>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Flex gap="1.3rem">
          <Flex alignItems="center" gap="0.4rem">
            <IconButton aria-label="Like" isRound={true} onClick={likePost}>
              {postLoading ? (
                <SkeletonCircle />
              ) : liked ? (
                <Icon
                  as={BsHeartFill}
                  boxSize={6}
                  cursor="pointer"
                  color="red.600"
                />
              ) : (
                <BsHeart size="1.5rem" cursor="pointer" />
              )}
            </IconButton>
            <Heading as="h5" size="sm" color="gray.600">
              {likes?.length}
            </Heading>
          </Flex>
          <Flex alignItems="center" gap="0.4rem">
            <IconButton
              aria-label="Comment"
              isRound={true}
              onClick={onCommentOpen}
            >
              {postLoading ? (
                <SkeletonCircle />
              ) : (
                <BiCommentDetail size="1.5rem" cursor="pointer" />
              )}
            </IconButton>
            <Heading as="h5" size="sm" color="gray.600">
              {commentsLength}
            </Heading>
          </Flex>
        </Flex>
        <IconButton aria-label="Comment" isRound={true} onClick={savePost}>
          {postLoading ? (
            <SkeletonCircle />
          ) : saved ? (
            <BsBookmarkFill size="1.5rem" cursor="pointer" />
          ) : (
            <BsBookmark size="1.5rem" cursor="pointer" />
          )}
        </IconButton>
      </Flex>
      {postLoading ? (
        <Skeleton height="1rem" width="16rem" />
      ) : (
        <Heading
          onClick={onCommentOpen}
          as="h5"
          size="sm"
          color="gray.500"
          cursor="pointer"
          _hover={{
            textDecorationLine: "underline",
          }}
        >
          View all comments
        </Heading>
      )}
      {/* comment modal open here */}
      <Drawer
        isOpen={isCommentOpen}
        placement="right"
        onClose={onCommentClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Comments</DrawerHeader>
          <DrawerBody>
            <CommentSection postId={props?.posts?.id} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default memo(Post);
