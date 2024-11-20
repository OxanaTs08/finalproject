import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./components/UserPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
// import MainPage from "./pages/MainPage";
import ListofPosts from "./components/ListofPosts";
import MyProfile from "./components/MyProfile";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";
import ExplorePage from "./pages/ExplorePage";
import EditProfile from "./components/EditProfile";
import PageNotFound from "./pages/PageNotFound";
import ChatPage from "./pages/ChatPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
// import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/forgotpassword" element={<ResetPasswordPage />} />
        <Route path="/changepassword/:token" element={<ChangePasswordPage />} />
        <Route path="*" element={<PageNotFound />} />
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/" element={<Layout />}>
          <Route path="/posts" element={<ListofPosts />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<ListofPosts />} />
          <Route path="/profile/:id" element={<UserPage />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/myprofile/:id" element={<MyProfile />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/updateprofile" element={<EditProfile />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/chatpage/:receiverId" element={<ChatPage />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
