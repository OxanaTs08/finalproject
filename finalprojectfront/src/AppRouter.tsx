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
import EditProfile from "./components/EditProfile";
import PageNotFound from "./pages/PageNotFound";
import ChatPage from "./pages/ChatPage";
// import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/forgotpassword" element={<ResetPasswordPage />} />
          <Route path="*" element={<PageNotFound />} />

          <Route path="/posts" element={<ListofPosts />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile/:id" element={<UserPage />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/updatprofile" element={<EditProfile />} />
          <Route path="/chatpage" element={<ChatPage />} />

          {/* <Route
            path="/posts"
            element={<PrivateRoute Component={ListofPosts} />}
          />
          <Route
            path="/mainpage"
            element={<PrivateRoute Component={MainPage} />}
          />
          <Route
            path="/create"
            element={<PrivateRoute Component={CreatePost} />}
          />
          <Route
            path="/post/:id"
            element={<PrivateRoute Component={PostPage} />}
          />
          <Route
            path="/profile/:id"
            element={<PrivateRoute Component={UserPage} />}
          />
          <Route
            path="/myprofile"
            element={<PrivateRoute Component={MyProfile} />}
          />
          <Route
            path="/explore"
            element={<PrivateRoute Component={ExplorePage} />}
          />
          <Route
            path="/updatprofile"
            element={<PrivateRoute Component={EditProfile} />}
          /> */}
          {/* <Route path="/chatpage" element={< PrivateRoute Component={ChatPage} />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
