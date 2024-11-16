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
      <Card sx={{ maxWidth: 800, m: "auto", mt: 3, p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ width: "50%" }}>
            {" "}
            {/* Изображение */}
            <CardMedia
              component="img"
              height="500"
              image={post?.images?.[0]}
              alt="Post image"
              sx={{ borderRadius: 2, mb: 2 }}
            />
          </Box>
          <Box>
            {/* Верхняя часть */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Avatar src={post?.user?.avatarUrl} />
              <Typography variant="h6">{post?.user?.username}</Typography>
              <IconButton sx={{ marginLeft: "auto" }}>
                <MoreVertIcon />
              </IconButton>
            </Stack>

            {/* Действия */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <IconButton onClick={handleToggleLike}>
                <FavoriteIcon sx={{ color: isLiked ? "red" : "gray" }} />
              </IconButton>
              <IconButton>
                <CommentIcon />
              </IconButton>
            </Stack>

            <Typography variant="body2" sx={{ mb: 2 }}>
              {post?.likes?.length} Likes
            </Typography>

            {/* Описание поста */}
            <Typography variant="body1" sx={{ mb: 2 }}>
              {post?.content}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Комментарии */}
            <Stack spacing={2} sx={{ mb: 2 }}>
              {comments?.map((comment) => (
                <Stack direction="row" alignItems="center" key={comment._id}>
                  <Avatar
                    src={comment?.user?.avatarUrl}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    <b>{comment?.user?.username}</b> {comment.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Добавить комментарий */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddComment}>
                Post
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
    </>

    // <>
    //   <Card sx={{ maxWidth: 800, m: "auto", p: 2, mt: 3 }}>
    //     <Box sx={{ display: "flex", flexDirection: "row" }}>
    //       <Box sx={{ width: "50%" }}>
    //         <CardMedia
    //           component="img"
    //           height="500"
    //           // image={post?.images.join(", ")}
    //           image={post?.images[0]}
    //           alt="post"
    //           sx={{ width: "50%", borderRadius: 2, mb: 2 }}
    //         />
    //       </Box>
    //       <Stack spacing={2} sx={{ width: "50%", p: 2 }}>
    //         <Paper
    //           sx={{
    //             display: "flex",
    //             alignItems: "center",
    //             p: 1,
    //             flexDirection: "row",
    //           }}
    //         >
    //           <Avatar src={user?.avatarUrl}></Avatar>
    //           <Typography variant="h6" sx={{ ml: 1 }}>
    //             {user?.username}
    //           </Typography>
    //           <IconButton
    //             aria-label="settings"
    //             onClick={handleSettings}
    //             sx={{ ml: "auto" }}
    //           >
    //             <MoreVertIcon />
    //           </IconButton>
    //         </Paper>
    //         <Paper>
    //           <Avatar src={user?.avatarUrl} />
    //           <Typography variant="h6" sx={{ ml: 1 }}>
    //             {user?.username}
    //           </Typography>
    //           <Typography variant="body1" sx={{ mt: 1 }}>
    //             {post?.content}
    //           </Typography>
    //           <Stack spacing={1}>
    //             {comments &&
    //               comments.map((comment) => (
    //                 <Box
    //                   key={comment._id}
    //                   sx={{ display: "flex", alignItems: "center" }}
    //                 >
    //                   <Avatar
    //                     src={commentUserAvatar}
    //                     sx={{ width: 30, height: 30 }}
    //                   />
    //                   <Typography
    //                     variant="body2"
    //                     sx={{ ml: 1, fontWeight: 500 }}
    //                   >
    //                     {commentUserName}
    //                   </Typography>
    //                   <Typography variant="body2" sx={{ ml: 1 }}>
    //                     {comment?.text}
    //                   </Typography>
    //                 </Box>
    //               ))}
    //           </Stack>
    //         </Paper>
    //         <Stack>
    //           <Box sx={{ alignItems: "center" }}>
    //             <IconButton aria-label="like" onClick={handleToggleLike}>
    //               <FavoriteIcon sx={{ color: isLiked ? "red" : "default" }} />
    //             </IconButton>
    //             <IconButton aria-label="comment">
    //               <CommentIcon />
    //             </IconButton>
    //           </Box>
    //           <Box>
    //             <Typography>{likesCount} Likes</Typography>
    //           </Box>
    //           <Box>
    //             <TextField
    //               fullWidth
    //               variant="outlined"
    //               size="small"
    //               placeholder="Add a comment..."
    //               value={newComment}
    //               onChange={(e) => setNewComment(e.target.value)}
    //               sx={{ marginRight: 1 }}
    //             />
    //             <Button variant="contained" onClick={handleAddComment}>
    //               Post
    //             </Button>
    //           </Box>
    //         </Stack>
    //       </Stack>
    //     </Box>
    //   </Card>
    //   <Dialog
    //     open={open}
    //     onClose={handleClose}
    //     aria-labelledby="alert-dialog-title"
    //     aria-describedby="alert-dialog-description"
    //   >
    //     <DialogContent>
    //       <Button variant="text">Delete</Button>
    //       <Divider />
    //       <StyledNavLink to={"/edit"}>
    //         <Button variant="text">Edit</Button>
    //       </StyledNavLink>
    //       <Divider />
    //       <Button variant="text" onClick={handleClose}>
    //         Go to Post
    //       </Button>
    //       <Divider />
    //       <Button variant="text">Copy Link</Button>
    //       <Divider />
    //       <Button variant="text" onClick={handleClose}>
    //         Cancel
    //       </Button>
    //     </DialogContent>
    //   </Dialog>
    // </>
  );
};

export default PostPage;
