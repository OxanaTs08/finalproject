import {
  Typography,
  styled,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IPost } from "../redux/postSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { createLike } from "../redux/likeSlice";
import { createFollowing } from "../redux/userSlice";
import MainButton from "./MainButton";
import { createNotification } from "../redux/notificationSlice";

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
  const username = user?.username;
  const userId = user?._id;

  const postId = post?._id;
  console.log(postId);

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
        console.log("followingId in deleting", userId);
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing(false);
      } else {
        console.log("followingId in creating", userId);
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <StyledNavLink to={`/profile/${user._id}`}>
          <CardHeader
            avatar={<Avatar aria-label="recipe">U</Avatar>}
            title={username}
            subheader={formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          />
        </StyledNavLink>
        <MainButton
          buttonText={isFollowing ? "Unfollow" : "Follow"}
          onClick={handleToggleFollow}
        />
        <StyledNavLink to={`/post/${post._id}`}>
          <CardMedia
            component="img"
            height="194"
            image={post.images.join(", ")}
            alt="post"
          />
        </StyledNavLink>
        <CardActions disableSpacing>
          <IconButton aria-label="like" onClick={handleToggleLike}>
            <FavoriteIcon sx={{ color: isLiked ? "red" : "default" }} />
          </IconButton>
          <IconButton aria-label="comment">
            <CommentIcon />
          </IconButton>
        </CardActions>

        <CardContent>
          <Typography>{likesCount} Likes</Typography>

          <Typography>
            {" "}
            Show All Comments ({post?.comments?.length}){" "}
          </Typography>
          <StyledNavLink to={`/posts/${post._id}`}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {post.content}
            </Typography>
          </StyledNavLink>
        </CardContent>
      </Card>
    </>
  );
};

export default PostCard;
