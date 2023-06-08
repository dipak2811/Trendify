import React, { useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AuthPrivateRoute from "./routes/AuthPrivateRoute";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./auth/LoginPage";
import SignUp from "./auth/SignupPage";
import Explore from "./pages/Explore";
import Library from "./pages/Library";
import YourPosts from "./pages/YourPosts";
import Search from "./pages/Search";
import Followers from "./pages/Followers";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./nav/Navbar";
import RightSidebar from "./nav/RightSidebar";
import LeftSidebar from "./nav/LeftSidebar";
import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Grid,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const urlDetails = useLocation();
  let showNav: boolean = false;
  if (
    urlDetails.pathname.includes("/login") ||
    urlDetails.pathname.includes("/signup") ||
    urlDetails.pathname.includes("/profile")
  )
    showNav = true;
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isMobileView] = useMediaQuery("(max-width: 48em)");
  const columnValues = useBreakpointValue({
    base: "100%",
    sm: "10% auto 24%",
    md: "30vw auto",
    lg: "18vw auto 34vw",
  });
  return (
    <>
      {showNav ? null : <Navbar />}
      <Grid
        gridTemplateColumns={showNav ? "100%" : columnValues}
        columnGap="2rem"
        marginLeft="1rem"
        marginRight="1rem"
      >
        {showNav ? null : <RightSidebar />}
        <Routes>
          <Route
            path="*"
            element={
              <PrivateRoute>
                <NotFound />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthPrivateRoute>
                <Login />
              </AuthPrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthPrivateRoute>
                <SignUp />
              </AuthPrivateRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <Library />
              </PrivateRoute>
            }
          />
          <Route
            path="/your_posts"
            element={
              <PrivateRoute>
                <YourPosts />
              </PrivateRoute>
            }
          />
          <Route
            path="/search/:caption"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:uuid"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/followers"
            element={
              <PrivateRoute>
                <Followers />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <Create />
              </PrivateRoute>
            }
          />
        </Routes>
        {showNav ? null : isMobileView ? (
          <>
            <Button
              pos="absolute"
              right="0"
              ref={btnRef}
              colorScheme="teal"
              onClick={onOpen}
              padding={0}
              background="#D6BCFA"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="m-0 p-0"
                width="100%"
                height="100%"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                />
              </svg>
            </Button>
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <LeftSidebar />
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <LeftSidebar />
        )}
      </Grid>
    </>
  );
}

export default App;
