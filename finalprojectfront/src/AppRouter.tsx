import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
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
          <Route path="/create" element={<CreatePost />} />
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
