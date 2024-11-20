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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
            {post && post.images.length > 1 ? (
              <>
                <Swiper
                  spaceBetween={10}
                  slidesPerView={1}
                  loop
                  autoplay={{ delay: 3000 }}
                >
                  {post.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <CardMedia
                        component="img"
                        height="194"
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

            {/* Описание  */}
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
  );
};

export default PostPage;
