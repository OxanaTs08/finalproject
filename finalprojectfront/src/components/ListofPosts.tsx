import { Box, Grid, Stack, Typography } from "@mui/material";
import { IPost, showPostsByFollowings } from "../redux/postSlice";
import { IUser, userById } from "../redux/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import PostCard from "../components/PostCard";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";
import AllSeen from "../assets/allseen.png.svg";

const ListofPosts = () => {
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
    dispatch(showPostsByFollowings());
  }, [dispatch]);

  const postsData = useSelector((state: RootState) => state.posts);
  const posts = postsData.posts || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentUserId) {
      dispatch(showPostsByFollowings());
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
      <Grid container spacing={2} justifyContent="center">
        {posts &&
          posts.map((post: IPost) => (
            <Grid item xs={12} sm={6} md={3} key={post._id}>
              <PostCard post={post} />
            </Grid>
          ))}
      </Grid>
      <Stack>
        <img
          src={AllSeen}
          alt="Finished"
          style={{ width: "82px", height: "82px" }}
        />
        <Typography>You've seen all the updates</Typography>
        <Typography color="#737373">
          You have viewed all new publications
        </Typography>
      </Stack>
    </Box>
  );
};

export default ListofPosts;
