import { Grid, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../nav/Navbar";
import RightSidebar from "../nav/RightSidebar";
import LeftSidebar from "../nav/LeftSidebar";
import CreateComponent from "../components/CreateComponent";

const Create = () => {
  useEffect(() => {
    document.title = "Create post";
  }, []);
  const columnValues = useBreakpointValue({
    base: "100%",
    sm: "10% auto 24%",
    md: "30vw auto",
    lg: "18vw auto 34vw",
  });
  return (
    <div>
      <Navbar />
      <Grid
        gridTemplateColumns={columnValues}
        columnGap="2rem"
        marginLeft="1rem"
        marginRight="1rem"
      >
        <RightSidebar />
        <CreateComponent />
        <LeftSidebar />
      </Grid>
    </div>
  );
};

export default Create;
