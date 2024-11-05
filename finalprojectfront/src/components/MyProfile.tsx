import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser, userById } from "../redux/userSlice";
import { IPost, postsByUser } from "../redux/postSlice";
import { useEffect } from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import MainButton from "./MainButton";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const MyProfile = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  const postsData = useSelector((state: RootState) => state.posts);
  const posts = postsData.posts || [];

  useEffect(() => {
    if (currentUserId) {
      dispatch(userById(currentUserId));
      dispatch(postsByUser());
    } else {
      console.log("No currentUserId");
    }
  }, [dispatch, currentUserId]);

  return (
    <>
      <Stack sx={{ gap: "16px" }}>
        {currentUser && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            {" "}
            <Box>photo</Box>
            <Stack>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography>{currentUser.username}</Typography>
                <MainButton
                  buttonText="Edit Profile"
                  onClick={() => {
                    navigate(`/${currentUserId}/edit`);
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography>{currentUser?.posts?.length} posts</Typography>
                <Typography>
                  {currentUser?.followings?.length} followings
                </Typography>
                <Typography>
                  {currentUser?.followers?.length} followers
                </Typography>
              </Box>
              <Box>description</Box>
            </Stack>
          </Box>
        )}

        <Grid container spacing={2} justifyContent="center">
          {posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Grid item xs={12} sm={6} md={3} key={post._id}>
                <PostCard post={post} />
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%" }}
            >
              У вас нет постов.
            </Typography>
          )}
        </Grid>
      </Stack>
    </>
  );
};
export default MyProfile;
