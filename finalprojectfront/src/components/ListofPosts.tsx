import { Box, Grid } from "@mui/material";
import { IPost, showPostsByFollowings } from "../redux/postSlice";
import { IUser, userById } from "../redux/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import PostCard from "../components/PostCard";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";
import InfoUpdates from "../components/InfoUpdates";

const ListofPosts = () => {
  const dispatch = useAppDispatch();
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  // console.log("Current user", currentUser);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentUserId) {
      dispatch(showPostsByFollowings());
    } else {
      console.log("No currentUserId");
    }
  }, [dispatch, currentUserId]);

  const postsData = useSelector((state: RootState) => state.posts);
  const posts = postsData.posts || [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        paddingTop: "40px",
      }}
    >
      <Grid container spacing={0} justifyContent="center">
        {posts &&
          posts.map((post: IPost) => (
            <Grid item xs={12} sm={6} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))}
      </Grid>
      <InfoUpdates />
    </Box>
  );
};

export default ListofPosts;
