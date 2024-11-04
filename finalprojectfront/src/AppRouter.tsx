import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import ListUsers from "./components/ListUsers";
import RegisterBlock from "./components/RegisterBlock";
import UserPage from "./components/UserPage";
import ForgotPassword from "./pages/ForgotPassword";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterBlock />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/listusers" element={<ListUsers />} />
          <Route path="/users/:id" element={<UserPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
