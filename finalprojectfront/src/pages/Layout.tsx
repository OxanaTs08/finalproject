import { Outlet, useLocation } from "react-router-dom";
// import { Helmet } from "react-helmet";
import GlobalStyle from "../GlobalStyle";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { headerWidth } from "../components/Header";

const Layout = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/";
  const isRegistrationPage = location.pathname === "/register";
  const isResetPasswordPage = location.pathname === "/forgotpassword";
  return (
    <div>
      <GlobalStyle />
      {!isLoginPage && !isRegistrationPage && !isResetPasswordPage && (
        <Header />
      )}

      <main style={{ marginLeft: `${headerWidth}px` }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
