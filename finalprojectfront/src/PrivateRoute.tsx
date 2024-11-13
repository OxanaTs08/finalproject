import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useState, useEffect } from "react";

const PrivateRoute: React.FC = () => {
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const token = useSelector((state: RootState) => state.users.token);

  useEffect(() => {
    if (token !== null) {
      setIsTokenLoaded(true);
    }
  }, [token]);

  console.log("token in private route:", token);

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user in private route", currentUser);

  if (!isTokenLoaded) {
    return <div>Loading...</div>;
  }
  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
