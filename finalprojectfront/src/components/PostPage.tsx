import {
  Dialog,
  DialogContent,
  Button,
  Card,
  Box,
  Stack,
  Avatar,
  IconButton,
  Paper,
  Typography,
  CardMedia,
  Divider,
  styled,
  TextField,
} from "@mui/material";
import { showPostById } from "../redux/postSlice";
import { createLike } from "../redux/likeSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { NavLink } from "react-router-dom";
import { showAllComments, createComment } from "../redux/commentSlice";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import { createNotification } from "../redux/notificationSlice";

const StyledNavLink = styled(NavLink)(() => ({
  color: "rgba(40, 40, 40, 1)",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
    color: "rgba(40, 40, 40, 0.5)",
  },
}));

const PostPage = () => {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState("");

  const [open, setOpen] = useState(false);
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  console.log("currentUserId", currentUserId);
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
  }, [dispatch, id]);

  const postData = useSelector((state: RootState) => state.posts);
  const posts = postData.posts || [];
  const post = posts.find((post) => post._id === id);
  console.log("post", post);
  const user = post?.user;
  console.log("user in post", user);
  const postId = post?._id;
  console.log("postId", postId);

  const [likesCount, setLikesCount] = useState<number>(
    post?.likes !== undefined ? post?.likes.length : 0
  );

  useEffect(() => {
    if (post?.likes && currentUserId) {
      setIsLiked(post.likes.includes(currentUserId));
    }
  }, [post?.likes, currentUserId]);

  useEffect(() => {
    if (postId) {
      dispatch(showAllComments(postId));
    }
  }, [dispatch, postId]);

  const comments = useSelector((state: RootState) => state.comments.comments);
  const comment = comments?.find((comment) => comment._id === id);
  const commentUser = comment?.user;
  const commentUserName = commentUser?.username;
  const commentUserAvatar = commentUser?.avatarUrl;

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

  const handleSettings = () => {
    console.log("Settings clicked");
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddComment = async () => {
    if (newComment && postId) {
      try {
        await dispatch(
          createComment({ postId: postId, text: newComment })
        ).unwrap();
        await dispatch(
          createNotification({
            post: post,
            user: post.user,
            type: "comment",
          })
        );
        setNewComment("");
      } catch (error) {
        console.log("error while adding comment", error);
      }
    }
  };

  return (
    <>
      <Card>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ width: "50%" }}>
            <CardMedia
              component="img"
              height="194"
              image={post?.images.join(", ")}
              alt="post"
            />
          </Box>
          <Stack sx={{ width: "50%" }}>
            <Paper sx={{ display: "flex", flexDirection: "row" }}>
              <Avatar src={user?.avatarUrl}></Avatar>
              <IconButton aria-label="settings" onClick={handleSettings}>
                <MoreVertIcon />
              </IconButton>
            </Paper>
            <Paper>
              <Avatar src={user?.avatarUrl} />
              <Typography>{user?.username}</Typography>
              <Typography>{post?.content}</Typography>
              <Stack>
                {comments &&
                  comments.map((comment) => (
                    <Box key={comment._id}>
                      <Avatar src={commentUserAvatar} />
                      <Typography>{commentUserName}</Typography>
                      <Typography>{comment?.text}</Typography>
                    </Box>
                  ))}
              </Stack>
            </Paper>
            <Stack>
              <Box>
                <IconButton aria-label="like" onClick={handleToggleLike}>
                  <FavoriteIcon sx={{ color: isLiked ? "red" : "default" }} />
                </IconButton>
                <IconButton aria-label="comment">
                  <CommentIcon />
                </IconButton>
              </Box>
              <Box>
                <Typography>{likesCount} Likes</Typography>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ marginRight: 1 }}
                />
                <Button variant="contained" onClick={handleAddComment}>
                  Post
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Button variant="text">Delete</Button>
          <Divider />
          <StyledNavLink to={"/edit"}>
            <Button variant="text">Edit</Button>
          </StyledNavLink>
          <Divider />
          <Button variant="text" onClick={handleClose}>
            Go to Post
          </Button>
          <Divider />
          <Button variant="text">Copy Link</Button>
          <Divider />
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostPage;
