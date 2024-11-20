import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser, userById, showCurrentUser } from "../redux/userSlice";
import { IPost, postsByUser } from "../redux/postSlice";
import { useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Grid,
  CardMedia,
  styled,
  Avatar,
  Dialog,
  DialogContent,
} from "@mui/material";
import MainButton from "./MainButton";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PostPage from "./PostPage";
import { useState } from "react";

const MyProfile = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  // console.log("Current user", currentUser);
  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  const postsData = useSelector((state: RootState) => state.posts);
  const posts = postsData.posts || [];

  useEffect(() => {
    dispatch(postsByUser());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (!currentUser) return <div>User not found or unauthorized</div>;

  const handleClickOpen = (postId: string) => {
    setOpen(true);
    navigate(`/myprofile/${postId}`, { replace: true });
  };

  const handleClose = () => {
    navigate("/myprofile");
    setOpen(false);
  };

  return (
    <>
      <Stack sx={{ gap: "20px" }}>
        {currentUser && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ width: "100px", height: "100px" }}
              src={currentUser?.avatarUrl}
            >
              {" "}
              {!currentUser.avatarUrl && <PersonOutlineOutlinedIcon />}
            </Avatar>
            <Stack sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="h5">{currentUser.username}</Typography>
                <MainButton
                  buttonText="Edit Profile"
                  onClick={() => {
                    navigate("/updateprofile");
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  mt: 1,
                }}
              >
                <Typography>{currentUser?.posts?.length} posts</Typography>
                <Typography>
                  {currentUser?.followings?.length} followings
                </Typography>
                <Typography>
                  {currentUser?.followers?.length} followers
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {" "}
                {currentUser?.description}{" "}
              </Typography>
            </Stack>
          </Box>
        )}

        <Grid container spacing={1} justifyContent="center">
          {posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={post._id}
                onClick={() => handleClickOpen(post._id)}
              >
                {post.images.length > 1 ? (
                  <>
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      loop
                      navigation
                      pagination={{ clickable: true }}
                      modules={[Navigation]}
                      // autoplay={{ delay: 3000 }}
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
                    image={post.images.join(", ")}
                    alt="post"
                  />
                )}
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%" }}
            >
              No posts created by you
            </Typography>
          )}
        </Grid>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
        key={open ? "open" : "closed"}
      >
        <DialogContent sx={{ padding: "0", width: "100%" }}>
          <PostPage />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default MyProfile;
