import { Box } from "@mui/material";
import { IPost, showAllPosts } from "../redux/postSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";
import InfoUpdates from "../components/InfoUpdates";
import { NavLink } from "react-router-dom";

const ExplorePage = () => {
  const dispatch = useAppDispatch();
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentUserId) {
      dispatch(showAllPosts());
    } else {
      console.log("No currentUserId");
    }
  }, [dispatch, currentUserId]);

  const postsData: { posts: IPost[] } = useSelector(
    (state: RootState) => state.posts
  );
  const posts = postsData.posts || [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "40px",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 280px)",
          gridAutoRows: "280px",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {posts &&
          posts.map((post: IPost, index) => {
            // const isLarge = (index + 1) % 5 === 0;
            const rowPattern = Math.floor(index / 5); // Чередование каждых 5 элементов
            const positionInPattern = index % 5;

            // Определяем, является ли текущее изображение большим
            const isLarge =
              (rowPattern % 2 === 0 && positionInPattern === 2) || // Большое в 3 позиции (ряды 1 и 2)
              (rowPattern % 2 === 1 && positionInPattern === 0); //
            return (
              <Box
                key={post._id}
                sx={{
                  gridRow: isLarge ? "span 2" : "span 1", // Большое занимает 2 строки
                  overflow: "hidden",
                }}
              >
                <NavLink to={`/post/${post._id}`}>
                  <img
                    src={post.images[0]}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </NavLink>
              </Box>
            );
          })}
      </Box>

      <InfoUpdates />
    </Box>
  );
};

export default ExplorePage;
