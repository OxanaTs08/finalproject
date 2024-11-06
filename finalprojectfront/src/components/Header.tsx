import {
  Box,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import MyProfile from "../components/MyProfile";
import ListofPosts from "../components/ListofPosts";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetState } from "../redux/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import CreatePost from "../components/CreatePost";

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
    path: "/createpost",
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

  return (
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
              <ListItemButton onClick={() => navigate(menuItem.path)}>
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
  );
};

export default Header;
