import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Card,
  Box,
  Stack,
  Avatar,
  IconButton,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { IPost, showPostById } from "../redux/postSlice";
import { createLike } from "../redux/likeSlice";
import { IUser, userById } from "../redux/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";
import { useState } from "react";
import { drawerWidth } from "../pages/MainPage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";

const PostPage = () => {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // const [open, setOpen] = useState(true);
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      dispatch(showPostById(id));
    }
  }, [dispatch]);

  const post = useSelector((state: RootState) => state.posts.post);
  const postId = post?._id;

  const [likesCount, setLikesCount] = useState<number>(
    post?.likes !== undefined ? post?.likes.length : 0
  );

  useEffect(() => {
    if (post?.likes && currentUserId) {
      setIsLiked(post.likes.includes(currentUserId));
    }
  }, [post?.likes, currentUserId]);

  const handleToggleLike = async () => {
    if (!postId) return;
    console.log("postId", postId);
    try {
      if (isLiked) {
        await dispatch(createLike({ postId }));
        setIsLiked((prevLiked) => !prevLiked);
        setLikesCount((prevCount) => prevCount - 1);
      } else {
        await dispatch(createLike({ postId }));
        setIsLiked((prevLiked) => !prevLiked);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <>
      <Card>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ width: "50%" }}>here is image</Box>
          <Stack sx={{ width: "50%" }}>
            <Paper sx={{ display: "flex", flexDirection: "row" }}>
              <Avatar>image</Avatar>
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            </Paper>
            <Paper>
              <Avatar>image</Avatar>
              <Typography>name</Typography>
              <Typography>text</Typography>
              <Grid container spacing={2} justifyContent="center">
                {/* {users && */}
                {/* users.map((user: IUser) => ( */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  // key={}
                >
                  {/* <CommentCard user={user} /> */}
                </Grid>
                {/* ))} */}
              </Grid>
            </Paper>
            <Paper>
              <IconButton aria-label="like" onClick={handleToggleLike}>
                <FavoriteIcon sx={{ color: isLiked ? "red" : "default" }} />
              </IconButton>
              <Typography>{likesCount} Likes</Typography>
            </Paper>
          </Stack>
        </Box>
      </Card>
      {/* <Backdrop
        open={open}
        onClick={handleClose}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1000,
          position: "absolute",
          left: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default PostPage;
