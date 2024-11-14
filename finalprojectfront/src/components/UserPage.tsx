import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser, userById, createFollowing } from "../redux/userSlice";
import { IPost, postsByAnotherUser } from "../redux/postSlice";
import { createRoom } from "../redux/roomSlice";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Grid,
  CardMedia,
  styled,
  Avatar,
} from "@mui/material";
import MainButton from "./MainButton";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { createNotification } from "../redux/notificationSlice";

const StyledNavLink = styled(NavLink)(() => ({
  color: "rgba(40, 40, 40, 1)",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
    color: "rgba(40, 40, 40, 0.5)",
  },
}));

const UserPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  const { id } = useParams();
  const userId = id;
  const user = useSelector((state: RootState) => state.users.user);
  console.log("id", id);

  const postsData = useSelector((state: RootState) => state.posts);
  const posts = postsData.posts || [];

  useEffect(() => {
    if (id) {
      dispatch(userById(id));
      dispatch(postsByAnotherUser(id));
    } else {
      console.log("No id");
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentUser?.followings && userId) {
      setIsFollowing(currentUser.followings.includes(userId));
    }
  }, [currentUser, userId]);

  const handleToggleFollow = async () => {
    // if (userId) return;
    try {
      if (isFollowing) {
        console.log("followingId in deleting", userId);
        if (!userId) return;
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing(false);
      } else {
        if (!userId) return;
        console.log("followingId in creating", userId);
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleToggleFollow = async () => {
  //   try {
  //     if (isFollowing) {
  //       // console.log("followingId in deleting", userId);
  //       await dispatch(createFollowing({ followingId: userId }));
  //       setIsFollowing((prev) => !prev);
  //     } else {
  //       // console.log("followingId in creating", userId);
  //       await dispatch(createFollowing({ followingId: userId }));
  //       setIsFollowing((prev) => !prev);
  //       await dispatch(
  //         createNotification({
  //           post: post,
  //           user: post.user,
  //           type: "follow",
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleOpenChat = () => {
    console.log("current user in handleOpenChat", currentUser);
    console.log("user id in handleOpenChat", userId);
    if (currentUser && userId) {
      navigate("/chatpage");
      dispatch(createRoom({ senderId: currentUser._id, receiverId: userId }));
    } else {
      console.error("No current user");
    }
  };

  return (
    <>
      <Stack sx={{ gap: "20px" }}>
        {user && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{ width: "100px", height: "120px" }}
              src={user?.avatarUrl}
            ></Avatar>
            <Stack sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="h5">{user.username}</Typography>
                {/* <MainButton
                  buttonText="Edit Profile"
                  onClick={() => {
                    navigate("/updateprofile");
                  }}
                /> */}
                <MainButton
                  buttonText={isFollowing ? "Unfollow" : "Follow"}
                  onClick={handleToggleFollow}
                />
                <MainButton
                  buttonText="Message"
                  onClick={() => {
                    handleOpenChat();
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  mt: 1,
                }}
              >
                <Typography>{user?.posts?.length} posts</Typography>
                <Typography>{user?.followings?.length} followings</Typography>
                <Typography>{user?.followers?.length} followers</Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {user.description}
              </Typography>
            </Stack>
          </Box>
        )}

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ marginTop: 3 }}
        >
          {posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <StyledNavLink to={`/post/${post._id}`}>
                  <CardMedia
                    component="img"
                    height="194"
                    // image={post.images.join(", ")}
                    image={post.images[0]}
                    alt="post"
                    sx={{
                      borderRadius: "8px",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </StyledNavLink>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%", mt: 4 }}
            >
              There are no posts
            </Typography>
          )}
        </Grid>
      </Stack>
    </>
  );
};
export default UserPage;

// import { Box, Typography, styled } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom";
// // import { NavLink } from "react-router-dom";
// import { IUser, userById, setCurrentUser } from "../redux/userSlice";
// import MainButton from "./MainButton";
// import { useDispatch, useSelector } from "react-redux";
// import { useAppDispatch } from "../hooks/useAppDispatch";
// import { createFollowing } from "../redux/userSlice";
// import { useEffect } from "react";
// import { RootState } from "../redux/store";
// import { useState } from "react";
// // import { current } from "@reduxjs/toolkit";

// // const StyledNavLink = styled(NavLink)(() => ({
// //   color: "rgba(40, 40, 40, 1)",
// //   textDecoration: "none",
// //   "&:hover": {
// //     cursor: "pointer",
// //     color: "rgba(40, 40, 40, 0.5)",
// //   },
// // }));
// const UserPage = () => {
//   const dispatch = useAppDispatch();
//   const { id } = useParams();
//   const [isFollowing, setIsFollowing] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const currentUserId = useSelector(
//     (state: RootState) => state.users.currentUser?._id
//   );
//   const currentUser = useSelector(
//     (state: RootState) => state.users.currentUser
//   );

//   const user = useSelector((state: RootState) => state.users.user);

//   useEffect(() => {
//     if (currentUserId) {
//       dispatch(userById(id as string));
//     }
//   }, [id, currentUserId, dispatch]);

//   useEffect(() => {
//     console.log("Current User:", currentUser);
//     console.log("User  ID:", id);
//   }, [currentUser, id]);

//   const handleToggleFollow = async () => {
//     if (!user?._id) return;
//     try {
//       if (isFollowing) {
//         console.log("followingId in deleting", user?._id);
//         await dispatch(createFollowing({ followingId: user?._id }));
//         setIsFollowing(false);
//       } else {
//         console.log("followingId in creating", user?._id);
//         await dispatch(createFollowing({ followingId: user?._id }));
//         setIsFollowing(true);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!user) return <Typography>Loading...</Typography>;
//   if (!user._id) return <Typography>User not found</Typography>;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//       <Typography sx={{ textAlign: "center" }}>{user.username}</Typography>
//       {isFollowing && (
//         <Typography sx={{ textAlign: "center" }}>
//           You Follow this user
//         </Typography>
//       )}
//       <MainButton
//         buttonText={isFollowing ? "Unfollow" : "Follow"}
//         onClick={handleToggleFollow}
//       />
//     </Box>
//   );
// };

// export default UserPage;
