import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import { Helmet } from "react-helmet";
import GlobalStyle from "../GlobalStyle";

const Layout = () => {
  return (
    <div>
      {/* <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Helmet> */}
      {/* <Header /> */}
      <GlobalStyle />
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
