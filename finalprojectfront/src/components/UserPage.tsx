import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser, userById, createFollowing } from "../redux/userSlice";
import { IPost, postsByAnotherUser } from "../redux/postSlice";
import { useEffect, useState } from "react";
import { Box, Typography, Stack, Grid, CardMedia, styled } from "@mui/material";
import MainButton from "./MainButton";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { useParams } from "react-router-dom";
import exampleforPost from "../assets/exampleforpost-3.jpeg";
import { NavLink } from "react-router-dom";

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

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
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
  }, [currentUser?.followings, userId]);

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

  return (
    <>
      <Stack sx={{ gap: "16px" }}>
        {user && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            {" "}
            <Box>photo</Box>
            <Stack>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography>{user.username}</Typography>
                {/* <MainButton
                  buttonText="Edit Profile"
                  onClick={() => {
                    navigate(`/${currentUserId}/edit`);
                  }}
                /> */}
                <MainButton
                  buttonText={isFollowing ? "Unfollow" : "Follow"}
                  onClick={handleToggleFollow}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography>{user?.posts?.length} posts</Typography>
                <Typography>{user?.followings?.length} followings</Typography>
                <Typography>{user?.followers?.length} followers</Typography>
              </Box>
              <Box>description</Box>
            </Stack>
          </Box>
        )}

        <Grid container spacing={2} justifyContent="center">
          {posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Grid item xs={12} sm={6} md={3} key={post._id}>
                <StyledNavLink to={`/post/:${post._id}`}>
                  <CardMedia
                    component="img"
                    height="194"
                    image={exampleforPost}
                    alt="post"
                  />
                </StyledNavLink>
                {/* <img 
                src={post.images} 
                /> */}
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%" }}
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
