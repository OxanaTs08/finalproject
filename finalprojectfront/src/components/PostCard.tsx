import {
  Box,
  Typography,
  styled,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IPost } from "../redux/postSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import exampleforPost from "../assets/exampleforpost-3.jpeg";
import CommentIcon from "@mui/icons-material/ModeCommentOutlined";
import { formatDistanceToNow } from "date-fns";

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

  const user = post.user;
  const username = user?.username;

  const handleLike = () => {};

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <StyledNavLink to={`/users/${user._id}`}>
          <CardHeader
            avatar={<Avatar aria-label="recipe">U</Avatar>}
            title={username}
            subheader={formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          />
        </StyledNavLink>
        <StyledNavLink to={`/posts/${post._id}`}>
          <CardMedia
            component="img"
            height="194"
            image={exampleforPost}
            alt="post"
          />
        </StyledNavLink>
        <CardActions disableSpacing>
          <IconButton
            aria-label="like"
            onClick={handleLike}
            // color={isLiked ? "error" : "default"}
          >
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="comment">
            <CommentIcon />
          </IconButton>
        </CardActions>

        <CardContent>
          <Typography>{post?.likes?.length} Likes</Typography>
          <StyledNavLink to={`/posts/${post._id}`}>
            <Typography>
              {" "}
              Show All Comments ({post?.comments?.length}){" "}
            </Typography>
            <Typography variant="body2">{post.content}</Typography>
          </StyledNavLink>
        </CardContent>
      </Card>
    </>
  );
};

export default PostCard;
