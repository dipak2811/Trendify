import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Avatar,
  Input,
  Button,
  useColorMode,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { app } from "../firebase";
import {
  onSnapshot,
  collection,
  getFirestore,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface Comment {
  id: string;
  comment: string;
  userId: string;
  userName: string;
  userPfp: string;
}

interface Props {
  postId: string;
}

const CommentSection = ({ postId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedComment, setUpdatedComment] = useState("");
  const leastDestructiveRef = useRef(null);
  const db = getFirestore(app);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", postId, "comments"),
      (snapshot) => {
        const updatedComments = snapshot.docs.map((doc) => ({
          ...(doc.data() as Comment),
          id: doc.id,
        }));
        setComments(updatedComments);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const handleAddComment = async () => {
    if (comment.length > 0 && comment.length <= 100) {
      await addDoc(collection(db, "posts", postId, "comments"), {
        comment: comment,
        userId: auth?.currentUser?.uid,
        userName: auth?.currentUser?.displayName,
        userPfp: auth?.currentUser?.photoURL,
      });
      setComment("");
    }
  };

  const handleDeleteComment = async () => {
    if (selectedComment) {
      await deleteDoc(doc(db, "posts", postId, "comments", selectedComment.id));
      setIsDeleteDialogOpen(false);
      setSelectedComment(null);
    }
  };

  const handleUpdateComment = async () => {
    if (selectedComment && updatedComment.length > 0) {
      await updateDoc(
        doc(db, "posts", postId, "comments", selectedComment.id),
        {
          comment: updatedComment,
        }
      );
      setIsUpdateDialogOpen(false);
      setSelectedComment(null);
      setUpdatedComment("");
    }
  };

  return (
    <Flex direction="column" height="91vh">
      <Flex flexGrow={1} direction="column" overflowY="scroll">
        {comments.map((comment: Comment) => (
          <Flex
            key={comment.id}
            width="100%"
            gap="0.6rem"
            cursor="pointer"
            _hover={{
              backgroundColor: colorMode === "light" ? "#efefef" : "#20242a",
            }}
            padding="1rem"
          >
            <Avatar
              src={comment?.userPfp}
              onClick={() => navigate("/profile/" + comment.userId)}
            />
            <Flex flexDirection="column" gap="0.6rem" alignItems="start">
              <Heading as="h5" size="md">
                {comment.userName}
              </Heading>
              <Heading as="h5" size="sm" color="gray.400">
                {comment.comment}
              </Heading>
            </Flex>
            {auth.currentUser?.uid === comment.userId ? (
              <>
                {" "}
                <Button
                  size="xs"
                  colorScheme="teal"
                  onClick={() => {
                    setSelectedComment(comment);
                    setUpdatedComment(comment.comment);
                    setIsUpdateDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={() => {
                    setSelectedComment(comment);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </>
            ) : null}
          </Flex>
        ))}
      </Flex>
      <Flex gap="1rem">
        <Avatar src={auth?.currentUser?.photoURL || ""} cursor="pointer" />
        <Input
          placeholder="Type here..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddComment();
            }
          }}
        />
        <Button
          onClick={handleAddComment}
          disabled={comment.length === 0 || comment.length > 100}
        >
          Send
        </Button>
      </Flex>

      {/* Delete Comment Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={leastDestructiveRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Comment
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this comment?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteComment} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Update Comment Dialog */}
      <AlertDialog
        isOpen={isUpdateDialogOpen}
        leastDestructiveRef={leastDestructiveRef}
        onClose={() => setIsUpdateDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Update Comment
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                placeholder="Type here..."
                onChange={(e) => setUpdatedComment(e.target.value)}
                value={updatedComment}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={handleUpdateComment} ml={3}>
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default CommentSection;
