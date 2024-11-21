import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser, userById, createFollowing } from "../redux/userSlice";
import { IPost, postsByAnotherUser } from "../redux/postSlice";
import { createRoom } from "../redux/roomSlice";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Grid,
  CardMedia,
  styled,
  Avatar,
} from "@mui/material";
import MainButton from "./MainButton";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { createNotification } from "../redux/notificationSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const StyledNavLink = styled(NavLink)(() => ({
  color: "rgba(40, 40, 40, 1)",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
    color: "rgba(40, 40, 40, 0.5)",
  },
}));

const UserPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  const { id } = useParams();
  const userId = id;
  const user = useSelector((state: RootState) => state.users.user);
  console.log("id", id);

  const [followerCount, setFollowerCount] = useState<number>(
    user?.followers !== undefined ? user.followers.length : 0
  );

  const postsData = useSelector((state: RootState) => state.posts);
  const posts = postsData.posts || [];

  useEffect(() => {
    if (id) {
      dispatch(userById(id));
      dispatch(postsByAnotherUser(id));
    } else {
      console.log("No id");
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentUser?.followings && userId) {
      setIsFollowing(currentUser.followings.includes(userId));
    }
  }, [currentUser, userId]);

  const handleToggleFollow = async () => {
    // if (userId) return;
    try {
      if (isFollowing) {
        console.log("followingId in deleting", userId);
        if (!userId) return;
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing(false);
        setFollowerCount((prevCount) => prevCount - 1);
      } else {
        if (!userId) return;
        console.log("followingId in creating", userId);
        await dispatch(createFollowing({ followingId: userId }));
        setIsFollowing(true);
        setFollowerCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenChat = () => {
    console.log("current user in handleOpenChat", currentUser);
    console.log("user id in handleOpenChat", userId);
    if (currentUser && userId) {
      navigate("/chatpage");
      dispatch(createRoom({ senderId: currentUser._id, receiverId: userId }));
    } else {
      console.error("No current user");
    }
  };

  return (
    <>
      <Stack sx={{ gap: "20px" }}>
        {user && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {" "}
            <Avatar
              sx={{ width: "100px", height: "100px" }}
              src={user?.avatarUrl}
            ></Avatar>
            <Stack sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography variant="h5">{user.username}</Typography>
                {/* <MainButton
                  buttonText="Edit Profile"
                  onClick={() => {
                    navigate("/updateprofile");
                  }}
                /> */}
                <MainButton
                  buttonText={isFollowing ? "Unfollow" : "Follow"}
                  onClick={handleToggleFollow}
                />
                <MainButton
                  buttonText="Message"
                  onClick={() => {
                    handleOpenChat();
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
                <Typography>{user?.posts?.length} posts</Typography>
                <Typography>{user?.followings?.length} followings</Typography>
                <Typography>{followerCount} followers</Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {user.description}
              </Typography>
            </Stack>
          </Box>
        )}

        <Grid
          container
          spacing={1}
          justifyContent="center"
          sx={{ marginTop: 3 }}
        >
          {posts.length > 0 ? (
            posts.map((post: IPost) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <StyledNavLink to={`/post/${post._id}`}>
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
                </StyledNavLink>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%", mt: 4 }}
            >
              There are no posts
            </Typography>
          )}
        </Grid>
      </Stack>
    </>
  );
};
export default UserPage;
