import {
  Typography,
  styled,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
  Stack,
  Box,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IPost } from "../redux/postSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import LikeIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "../assets/comment.png";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { createLike } from "../redux/likeSlice";
import { createFollowing } from "../redux/userSlice";
import MainButton from "./MainButton";
import { createNotification } from "../redux/notificationSlice";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { showPostsByFollowings } from "../redux/postSlice";
import dot from "../assets/•.png";

const StyledNavLink = styled(NavLink)(() => ({
  color: "rgba(40, 40, 40, 1)",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
    color: "rgba(40, 40, 40, 0.5)",
  },
}));

const PostCard = ({ post }: { post: IPost }) => {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    post.likes !== undefined ? post.likes.length : 0
  );

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  const user = post.user;
  // console.log("user who wrote the post", user);
  const username = user?.username;
  const userId = user?._id;
  const profilePicture = user?.avatarUrl;

  const postId = post?._id;
  // console.log(postId);

  useEffect(() => {
    if (post.likes && currentUserId) {
      setIsLiked(post.likes.includes(currentUserId));
    }
  }, [post.likes, currentUserId]);

  useEffect(() => {
    if (currentUser?.followings && userId) {
      setIsFollowing(currentUser.followings.includes(userId));
    }
  }, [currentUser?.followings, userId]);

  const handleToggleLike = async () => {
    if (!postId) return;
    // console.log("postId", postId);
    try {
      if (isLiked) {
        await dispatch(createLike({ postId }));
        setIsLiked((prevLiked) => !prevLiked);
        setLikesCount((prevCount) => prevCount - 1);
      } else {
        await dispatch(createLike({ postId }));
        setIsLiked((prevLiked) => !prevLiked);
        setLikesCount((prevCount) => prevCount + 1);
        await dispatch(
          createNotification({
            post: post,
            user: post.user,
            type: "like",
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        // console.log("followingId in deleting", userId);
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing((prev) => !prev);
      } else {
        // console.log("followingId in creating", userId);
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing((prev) => !prev);
        await dispatch(
          createNotification({
            post: post,
            user: post.user,
            type: "follow",
          })
        );
      }
      await dispatch(showPostsByFollowings());
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Stack
        sx={{
          maxWidth: 345,
          borderRadius: 1,
          gap: "10px",
          borderBottom: "1px solid #EFEFEF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <StyledNavLink to={`/profile/${user._id}`}>
            <Avatar src={profilePicture} />
            {/* {!profilePicture && <PersonOutlineOutlinedIcon />} */}
          </StyledNavLink>
          <Typography sx={{ fontWeight: "bold" }}>{username}</Typography>
          <img src={dot} alt="" style={{ color: "#737373" }} />
          <Typography sx={{ color: "#737373", fontSize: "12px" }}>
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </Typography>
          <img src={dot} alt="" style={{ color: "#737373" }} />
          <Button
            sx={{ textTransform: "none", fontWeight: "bold" }}
            onClick={handleToggleFollow}
          >
            Follow
          </Button>
        </Box>

        <StyledNavLink to={`/post/${post._id}`}>
          <CardMedia
            component="img"
            // height="194"
            image={post.images[0]} //carousel
            alt="post"
            sx={{ aspectRatio: "1/1", objectFit: "cover" }}
          />
        </StyledNavLink>
        <StyledNavLink to={`/post/${post._id}`}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              marginBottom: 2,
            }}
          >
            {post.content}
          </Typography>
        </StyledNavLink>

        <Box sx={{ display: "flex", gap: "10px", alignItems: "left" }}>
          <IconButton aria-label="like" onClick={handleToggleLike}>
            {isLiked ? (
              <FavoriteIcon sx={{ color: "red" }} />
            ) : (
              <LikeIcon sx={{ color: "black" }} />
            )}
          </IconButton>
          <IconButton aria-label="comment">
            <img src={CommentIcon} alt="" />
          </IconButton>
        </Box>

        <CardContent>
          <Typography sx={{ fontWeight: "bold" }}>
            {likesCount} likes
          </Typography>
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              display: "-webkit-box",
              color: "grey",
            }}
          >
            View All Comments ({post?.comments?.length}){" "}
          </Typography>
        </CardContent>
      </Stack>
    </>
  );
};

export default PostCard;
