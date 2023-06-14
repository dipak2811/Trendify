import React, { useState } from "react";
import { Flex, Avatar, Heading, Button, Skeleton } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Props = {
  userPfp: string;
  userId: string;
  userName: string;
};

const WhoToFollow = (props: Props) => {
  const [usersLoading, setusersLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <Flex justifyContent="space-between">
      <Flex flexDirection="row" gap="0.6rem" alignItems="center">
        <Avatar
          cursor="pointer"
          src={props?.userPfp}
          onLoad={() => {
            setusersLoading(false);
          }}
          onClick={() => {
            navigate("/profile/" + props?.userId);
          }}
        />
        {!usersLoading ? (
          <Heading as="h5" size="sm">
            {props?.userName}
          </Heading>
        ) : (
          <Skeleton width="5rem" height="1rem" />
        )}
      </Flex>
      {!usersLoading ? (
        <Button
          backgroundColor="#ACBCFF"
          variant="solid"
          onClick={() => {
            navigate("/profile/" + props?.userId);
          }}
        >
          <FaExternalLinkAlt />
        </Button>
      ) : (
        <Skeleton width="5rem" height="3rem" />
      )}
    </Flex>
  );
};

export default WhoToFollow;
