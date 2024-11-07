import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
// import ListUsers from "./components/ListUsers";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./components/UserPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainPage from "./pages/MainPage";
import ListofPosts from "./components/ListofPosts";
import MyProfile from "./components/MyProfile";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";
import ExplorePage from "./pages/ExplorePage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/posts" element={<ListofPosts />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile/:id" element={<UserPage />} />
          <Route path="/forgotpassword" element={<ResetPasswordPage />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
