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
  styled,
  TextField,
  Avatar,
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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetState } from "../redux/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { IUser, searchUsersByName } from "../redux/userSlice";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

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

const StyledTextField = styled(TextField)(() => ({
  border: "1px solid #DBDBDB",
  borderRadius: "8px",
  color: " #737373",
  backgroundColor: "#FAFAFA",
}));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");

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
  const users = useSelector((state: RootState) => state.users.users);
  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  const isError = useSelector((state: RootState) => state.users.isError);

  useEffect(() => {
    if (query) {
      console.log("query", query);
      dispatch(searchUsersByName(query));
    }
  }, [dispatch, query]);

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
                      : menuItem.name === "Notifications"
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
        <Box sx={{ padding: "20px" }}>
          {drawerContent === "search" && (
            <>
              <StyledTextField
                fullWidth
                margin="normal"
                type="text"
                label="Search users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // onChange={handleNameChange}
              />
              {isLoading && <Typography>Loading...</Typography>}
              {isError && <Typography color="error">{isError}</Typography>}
              {users.length > 0 && (
                <List>
                  {users.map((user) => (
                    <ListItem key={user._id}>
                      <Avatar
                        onClick={() => navigate(`/profile/${user._id}`)}
                        sx={{ cursor: "pointer" }}
                        src={user.avatarUrl}
                      />
                      <ListItemText primary={user.username} />
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </Box>
        {drawerContent === "notifications" && (
          <Box sx={{ padding: "20px" }}>
            <Typography>Notifications</Typography>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default Header;
