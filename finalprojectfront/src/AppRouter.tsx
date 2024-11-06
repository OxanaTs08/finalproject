import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import ListUsers from "./components/ListUsers";
import RegisterPage from "./pages/RegisterPage";
// import UserPage from "./components/UserPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MainPage from "./pages/MainPage";
// import MyProfile from "./components/MyProfile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/listusers" element={<ListUsers />} />
          {/* <Route path="/users/:id" element={<UserPage />} /> */}
          <Route path="/forgotpassword" element={<ResetPasswordPage />} />
          {/* <Route path="/myprofile" element={<MyProfile />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
