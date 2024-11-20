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
import { showPostById, deletePost } from "../redux/postSlice";
import { createLike } from "../redux/likeSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { replace, useParams } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { NavLink } from "react-router-dom";
import { showAllComments, createComment } from "../redux/commentSlice";
import CommentIcon from "../assets/comment.png";
import { createNotification } from "../redux/notificationSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState("");

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  // console.log("currentUserId", currentUserId);
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
  const user = post?.user?._id === currentUserId ? currentUser : post?.user;
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

  const handleDeletePost = () => {
    if (id) {
      dispatch(deletePost(id));
    }
    handleClose();
    navigate("/myprofile", { replace: true });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        {/* Изображение */}
        <Box sx={{ width: "50%" }}>
          {post && post.images.length > 1 ? (
            <>
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation]}
              >
                {post.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <CardMedia
                      component="img"
                      height="500"
                      image={`${image}?h=120&fit=crop&auto=format`}
                      alt={`post image ${index + 1}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <CardMedia
              component="img"
              height="194"
              image={post?.images?.join(", ")}
              alt="post"
            />
          )}
          {/* <CardMedia
              component="img"
              height="500"
              image={post?.images?.[0]}
              alt="Post image"
              sx={{ borderRadius: 2, mb: 2 }}
            /> */}
        </Box>
        {/* текстовая часть */}
        <Box sx={{ width: "50%" }}>
          {/* Верхняя часть */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {post?.user === currentUserId ? (
                <>
                  <Avatar src={currentUser?.avatarUrl} />
                  <Typography variant="h6">{currentUser?.username}</Typography>
                </>
              ) : (
                <>
                  <Avatar src={user?.avatarUrl} />
                  <Typography variant="h6">{user?.username}</Typography>
                </>
              )}
            </Box>

            <IconButton sx={{ marginLeft: "auto" }} onClick={handleSettings}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Описание  */}
          <Box sx={{ display: "flex", p: 1, gap: 1 }}>
            {post?.user === currentUserId ? (
              <Avatar src={currentUser?.avatarUrl} />
            ) : (
              <Avatar src={user?.avatarUrl} />
            )}
            <Stack>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post?.user === currentUserId ? (
                  <b>{currentUser?.username} </b>
                ) : (
                  <b>{user?.username} </b>
                )}

                {post?.content}
              </Typography>
              <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                {isValid(new Date(post?.createdAt ?? ""))
                  ? formatDistanceToNow(new Date(post?.createdAt ?? ""), {
                      addSuffix: true,
                    })
                  : "Date is not Valid"}
              </Typography>
            </Stack>
          </Box>
          {/* Комментарии */}
          <Stack spacing={2} sx={{ mb: 2, p: 1 }}>
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

          {/* Действия */}
          <Stack spacing={2} sx={{ mb: 2, p: 1 }}>
            <Box sx={{ display: "flex " }}>
              <IconButton onClick={handleToggleLike}>
                <FavoriteIcon sx={{ color: isLiked ? "red" : "gray" }} />
              </IconButton>
              <IconButton aria-label="comment">
                <img src={CommentIcon} alt="" />
              </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {post?.likes?.length} Likes
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Добавить комментарий */}
          <Stack direction="row" spacing={2} sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                "& .MuiInput-underline:before": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:after": {
                  borderBottom: "none",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              }}
            />
            <Button
              variant="text"
              onClick={handleAddComment}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          {post?.user === currentUserId && (
            <Button
              variant="text"
              sx={{ textTransform: "none", fontWeight: "bold" }}
              onClick={handleDeletePost}
            >
              Delete
            </Button>
          )}
          <Divider />
          <StyledNavLink to={"/edit"}>
            <Button
              variant="text"
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Edit
            </Button>
          </StyledNavLink>
          <Divider />
          <Button
            variant="text"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={handleClose}
          >
            Go to Post
          </Button>
          <Divider />
          <Button
            variant="text"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Copy Link
          </Button>
          <Divider />
          <Button
            variant="text"
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostPage;
