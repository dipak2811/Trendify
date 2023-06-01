import React, { useEffect } from "react";
import CreateComponent from "../components/CreateComponent";

const Create = () => {
  useEffect(() => {
    document.title = "Create post";
  }, []);
  return (
    <div>
        <CreateComponent />
    </div>
  );
};

export default Create;
