import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../firebase";
import Loader from "../components/Loader";

type AuthPrivateRouteProps = {
  children: ReactNode;
};

const AuthPrivateRoute: React.FC<AuthPrivateRouteProps> = ({ children }) => {
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);

  return loading ? (
    <Loader />
  ) : !user ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default AuthPrivateRoute;
