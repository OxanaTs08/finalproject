import {
  Box,
  Toolbar,
  AppBar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useState } from "react";
import { resetState } from "../redux/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import Notifications from "../components/Notifications";
import Search from "./ Search";

export const headerWidth = 245;

const menu = [
  {
    path: "/posts",
    name: "Home",
    icon: HomeOutlinedIcon,
  },
  {
    path: "/posts",
    name: "Search",
    icon: SearchOutlinedIcon,
  },
  {
    path: "/explore",
    name: "Explore",
    icon: ExploreOutlinedIcon,
  },
  {
    path: "/posts",
    name: "Messages",
    icon: MessageOutlinedIcon,
  },
  {
    path: "/posts",
    name: "Notifications",
    icon: NotificationsNoneOutlinedIcon,
  },
  {
    path: "/create",
    name: "Create",
    icon: CreateOutlinedIcon,
  },
  {
    path: "/myprofile",
    name: "Profile",
    icon: PersonOutlinedIcon,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(resetState());
    navigate("/");
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<
    "search" | "notifications" | null
  >(null);

  const toggleDrawer =
    (open: boolean, content: "search" | "notifications" | null = null) =>
    () => {
      setIsDrawerOpen(open);
      setDrawerContent(content);
    };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          left: 0,
          right: "auto",
          // width: "auto",
          backgroundColor: "white",
          color: "black",
          height: "100%",
          width: headerWidth,
        }}
      >
        <Toolbar>
          <List>
            {menu.map((menuItem, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() =>
                    menuItem.name === "Search"
                      ? toggleDrawer(true, "search")()
                      : menuItem.name === "Notifications"
                      ? toggleDrawer(true, "notifications")()
                      : navigate(menuItem.path)
                  }
                >
                  <ListItemIcon>
                    <menuItem.icon />
                  </ListItemIcon>
                  <ListItemText>{menuItem.name} </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <MainButton buttonText={"Log Out"} onClick={handleLogOut} />
          </List>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        // open={toggleDrawer(true)}
        PaperProps={{
          sx: {
            width: "300px",
            marginLeft: `${headerWidth}px`,
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "transparent",
          },
        }}
      >
        <>
          {drawerContent === "search" && (
            <Box sx={{ padding: "20px" }}>
              <Search />
            </Box>
          )}

          {drawerContent === "notifications" && (
            <Box sx={{ padding: "20px" }}>
              <Typography>Notifications</Typography>
              <Notifications />
            </Box>
          )}
        </>
      </Drawer>
    </>
  );
};

export default Header;
