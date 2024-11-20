import {
  Typography,
  styled,
  Avatar,
  IconButton,
  CardMedia,
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
import { createNotification } from "../redux/notificationSlice";
import { showPostsByFollowings } from "../redux/postSlice";
import dot from "../assets/•.png";
import { showAllComments, IComment } from "../redux/commentSlice";
import React from "react";

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
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(
    post.likes !== undefined ? post.likes.length : 0
  );

  const postId = post?._id;
  const user = post.user;
  const username = user?.username;
  const userId = user?._id;
  const profilePicture = user?.avatarUrl;

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

  useEffect(() => {
    if (postId) {
      dispatch(showAllComments(postId));
    }
  }, [dispatch]);

  console.log("postId", postId);

  const comments: IComment[] | undefined = useSelector((state: RootState) =>
    state.comments.comments?.filter((comment) => comment?.post === postId)
  );
  console.log("comments", comments);

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
          borderBottom: "1px solid #EFEFEF",
          paddingBottom: "20px",
        }}
      >
        {/* header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 0",
          }}
        >
          <StyledNavLink to={`/profile/${user._id}`}>
            <Avatar src={profilePicture} />
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
            Unfollow
          </Button>
        </Box>
        {/* images */}

        <StyledNavLink to={`/post/${post._id}`}>
          <CardMedia
            component="img"
            // height="194"
            image={post.images[0]} //carousel
            alt="post"
            sx={{ aspectRatio: "1/1", objectFit: "cover" }}
          />
        </StyledNavLink>
        {/* like and komment button */}
        <Stack>
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
          <Typography sx={{ fontWeight: "bold" }}>
            {likesCount} likes
          </Typography>
        </Stack>

        {/* text content */}
        <StyledNavLink to={`/post/${post._id}`}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "7px",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>{username}</Typography>
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
          </Box>
        </StyledNavLink>

        <Stack sx={{ paddingBottom: "10px" }}>
          {/* Комментарии */}
          <Box>
            {comments && comments.length > 0 ? (
              [...comments].slice(0, 1).map((comment: IComment) => (
                <Box alignItems="center" key={comment._id}>
                  <StyledNavLink to={`/post/${post._id}`}>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      <b>{comment?.user?.username}</b> {comment.text} ...
                    </Typography>
                  </StyledNavLink>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "gray" }}>
                No comments yet.
              </Typography>
            )}
          </Box>
          <StyledNavLink to={`/post/${post._id}`}>
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
          </StyledNavLink>
        </Stack>
      </Stack>
    </>
  );
};

export default React.memo(PostCard);
