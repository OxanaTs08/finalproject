import { Box, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import { NavLink } from "react-router-dom";
import {
  IUser,
  userById,
  setCurrentUser,
  deleteFollowing,
  resetState,
} from "../redux/userSlice";
import MainButton from "./MainButton";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { createFollowing } from "../redux/userSlice";
import { useEffect } from "react";
import { RootState } from "../redux/store";
import { useState } from "react";
// import { current } from "@reduxjs/toolkit";

// const StyledNavLink = styled(NavLink)(() => ({
//   color: "rgba(40, 40, 40, 1)",
//   textDecoration: "none",
//   "&:hover": {
//     cursor: "pointer",
//     color: "rgba(40, 40, 40, 0.5)",
//   },
// }));
const UserPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const navigate = useNavigate();

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  const user = useSelector((state: RootState) => state.users.user);

  useEffect(() => {
    if (currentUserId) {
      dispatch(userById(id as string));
    }
  }, [id, currentUserId, dispatch]);

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("User  ID:", id);
  }, [currentUser, id]);

  const handleToggleFollow = async () => {
    if (!user?._id) return;
    try {
      if (isFollowing) {
        console.log("followingId in deleting", user?._id);
        await dispatch(deleteFollowing({ followingId: user?._id }));
        setIsFollowing(false);
      } else {
        console.log("followingId in creating", user?._id);
        await dispatch(createFollowing({ followingId: user?._id }));
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;
  if (!user._id) return <Typography>User not found</Typography>;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(resetState());
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography sx={{ textAlign: "center" }}>{user.username}</Typography>
      {isFollowing && (
        <Typography sx={{ textAlign: "center" }}>
          You Follow this user
        </Typography>
      )}
      <MainButton
        buttonText={isFollowing ? "Unfollow" : "Follow"}
        onClick={handleToggleFollow}
      />
      <MainButton buttonText={"Log Out"} onClick={handleLogOut} />
    </Box>
  );
};

export default UserPage;
