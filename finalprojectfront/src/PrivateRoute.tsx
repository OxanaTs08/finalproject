import { Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { showCurrentUser } from "./redux/userSlice";
import { useAppDispatch } from "./hooks/useAppDispatch";

interface PrivateRouteProps {
  Component: React.ComponentType;
}

const PrivateRoute = ({ Component }: PrivateRouteProps) => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.users.currentUser
  );

  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(showCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};
export default PrivateRoute;
