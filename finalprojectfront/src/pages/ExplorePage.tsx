import { Box, Grid } from "@mui/material";
import { IPost, showAllPosts } from "../redux/postSlice";
import { IUser, userById } from "../redux/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import PostCard from "../components/PostCard";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";
import InfoUpdates from "../components/InfoUpdates";

const ExplorePage = () => {
  const dispatch = useAppDispatch();
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(showAllPosts());
  }, [dispatch]);

  const postsData: { posts: IPost[] } = useSelector(
    (state: RootState) => state.posts
  );
  const posts = postsData.posts || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentUserId) {
      dispatch(showAllPosts());
    } else {
      console.log("No currentUserId");
    }
  }, [dispatch, currentUserId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        paddingTop: "40px",
      }}
    >
      <Grid
        container
        spacing={0}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(5, 1fr)",
        }}
        justifyContent="center"
      >
        {posts &&
          posts.map((post: IPost) => (
            <Grid item xs={12} sm={6} md={3} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))}
      </Grid>
      <InfoUpdates />
    </Box>
  );
};

export default ExplorePage;
