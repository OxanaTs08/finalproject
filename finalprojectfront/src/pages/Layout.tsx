import { Outlet } from "react-router-dom";
// import { Helmet } from "react-helmet";
import GlobalStyle from "../GlobalStyle";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div>
      <GlobalStyle />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
