import { AppBar, Box, Toolbar, styled, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)(() => ({
  color: "#737373",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
  },
}));

const menu = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/search",
    name: "Search",
  },
  {
    path: "/explore",
    name: "Explore",
  },
  {
    path: "/messages",
    name: "Messages",
  },
  {
    path: "/notifications",
    name: "Notifications",
  },
  {
    path: "/create",
    name: "Create",
  },
];

const Footer = () => {
  return (
    <AppBar
      position="static"
      sx={{
        width: "100%",
        boxShadow: "none",
        top: "auto",
        bottom: 0,
        mt: "auto",
        padding: "80px 0 80px 0",
        backgroundColor: "white",
      }}
    >
      <Toolbar sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "40px",
            width: "100%",
          }}
        >
          <Box>
            <Grid container spacing={2} justifyContent="center">
              {menu.map((menuItem, index) => (
                <Grid item key={index}>
                  <StyledLink to={menuItem.path}>
                    <Typography>{menuItem.name}</Typography>
                  </StyledLink>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box>
            <Typography sx={{ textAlign: "center" }} color="#737373">
              © 2024 ICHgram
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
