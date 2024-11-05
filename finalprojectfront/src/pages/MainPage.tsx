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

const drawerWidth = 245;

const menu = [
  {
    component: <ListofPosts />,
    name: "Home",
    icon: HomeOutlinedIcon,
  },
  {
    component: <MyProfile />,
    name: "Search",
    icon: SearchOutlinedIcon,
  },
  {
    component: <MyProfile />,
    name: "Explore",
    icon: ExploreOutlinedIcon,
  },
  {
    component: <MyProfile />,
    name: "Messages",
    icon: MessageOutlinedIcon,
  },
  {
    component: <MyProfile />,
    name: "Notifications",
    icon: NotificationsNoneOutlinedIcon,
  },
  {
    component: <MyProfile />,
    name: "Create",
    icon: CreateOutlinedIcon,
  },
  {
    component: <MyProfile />,
    name: "Profile",
    icon: PersonOutlinedIcon,
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState(menu[0].component);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <List>
          {menu.map((menuItem, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => setSelectedComponent(menuItem.component)}
              >
                <ListItemIcon>
                  <menuItem.icon />
                </ListItemIcon>
                <ListItemText>{menuItem.name} </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          padding: "40px",
        }}
      >
        {selectedComponent}
      </Box>
    </Box>
  );
};

export default MainPage;
