import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ListItem,
  List,
  Avatar,
  ListItemText,
  Link,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser } from "../redux/userSlice";
import { IRoom, showRooms } from "../redux/roomSlice";
import { NavLink } from "react-router-dom";

function ChatPageUsersList() {
  const dispatch = useAppDispatch();

  const currentUserId: string | null = useSelector(
    (state: RootState) => state.users.currentUser?._id ?? null
  );
  console.log("currentUserId in chat page", currentUserId);

  useEffect(() => {
    dispatch(showRooms());
  }, [dispatch]);

  const rooms: IRoom[] | null = useSelector(
    (state: RootState) => state.rooms.rooms || []
  );
  const room: IRoom | null = rooms?.length > 0 ? rooms[0] : null;
  const receiver: IUser | undefined = room?.users.find(
    (user: IUser) => user._id !== currentUserId
  );
  console.log("receiver in chat page after find", receiver);
  // const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "25% 75%",
        gap: 2,
      }}
    >
      <Box sx={{ borderRight: "1px solid #EFEFEF", overflowY: "auto" }}>
        {rooms?.length ? (
          <List sx={{ height: "100%", overflowY: "auto" }}>
            {rooms.map((room) => {
              const receiverinRooms: IUser | undefined = room?.users.find(
                (user: IUser) => user._id !== currentUserId
              );
              if (!receiverinRooms) return null;
              return (
                <NavLink to={`/chatpage/${receiverinRooms._id}`}>
                  <ListItem
                    key={room._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "10px",
                      "&:hover": { backgroundColor: "#EFEFEF" },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        marginRight: 2,
                        cursor: "pointer",
                      }}
                      src={receiverinRooms.avatarUrl}
                    />
                    <ListItemText primary={receiverinRooms.username} />
                  </ListItem>
                </NavLink>
              );
            })}
          </List>
        ) : (
          <Typography variant="h6">No rooms</Typography>
        )}
      </Box>
    </Box>
  );
}

export default ChatPageUsersList;
