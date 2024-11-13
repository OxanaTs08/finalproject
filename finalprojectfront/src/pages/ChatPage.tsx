import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Picker from "emoji-picker-react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Card,
  ListItem,
  List,
  Avatar,
  ListItemText,
  Drawer,
} from "@mui/material";
import MainButton from "../components/MainButton";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { headerWidth } from "../components/Header";
import { RootState } from "../redux/store";
import { IUser, userById, userByIdBody } from "../redux/userSlice";
import { IRoom, showRooms } from "../redux/roomSlice";

interface IMessage {
  sender: string;
  receiver: string;
  text: string;
  createdAt: Date;
}

// const sockets = io("http://localhost:4003");

function ChatPage() {
  const dispatch = useAppDispatch();
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const location = useLocation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const navigate = useNavigate();

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
  console.log("rooms in chatpage", rooms);

  const room: IRoom | null = rooms.length > 0 ? rooms[0] : null;

  console.log("room in chatpage", room);

  const receiver: IUser | undefined = room?.users.find(
    (user: IUser) => user._id !== currentUserId
  );
  console.log("correponderId in chatpage", receiver);

  const username = receiver?.username;
  console.log("username in chatpage", username);

  const avatarUrl = receiver?.avatarUrl;
  console.log("avatarUrl in chatpage", avatarUrl);

  const [socket, setSocket] = useState<Socket | null>(null);

  const handleUserClick = (selectedUser: IUser) => {
    setReceiverId(selectedUser?._id);
    navigate(`/ChatPage/${selectedUser._id}`, {
      state: { receiverId: selectedUser._id },
    });

    console.log("Emitting selectedUser with receiverId:", receiverId);
    socket?.emit("selectedtUser", {
      receiverId: selectedUser._id,
    });
  };

  // useEffect(() => {
  //   const locationPath = location.pathname;

  //   if (locationPath.includes("/chatpage") && currentUserId) {
  //     const newSocket = io("http://localhost:4003");
  //     setSocket(newSocket);
  //     newSocket.on("connect", () => {
  //       if (receiverId) {
  //         newSocket.emit("join", { senderId: currentUserId, receiverId });
  //         newSocket.emit("getPreviousMessages", {
  //           senderId: currentUserId,
  //           receiverId,
  //         });
  //       }
  //     });
  //     newSocket.on("message", ({ data }) =>
  //       setMessages((prev) => [...prev, data.user])
  //     );
  //     newSocket.on("previousMessages", (previousMessages) =>
  //       setMessages(previousMessages)
  //     );

  //     return () => {
  //       newSocket.emit("leftRoom", { sender: currentUserId });
  //       newSocket.close();
  //     };
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.emit("leftRoom", { sender: currentUserId });
  //       socket.close();
  //       setSocket(null);
  //     }
  //   };
  // }, [location.pathname, currentUserId, receiverId]);

  // useEffect(() => {
  //   const locationPath = location.pathname;
  //   if (locationPath.includes("/chatpage") && currentUserId && receiverId) {
  //     dispatch(userById(receiverId));
  //     sockets.emit("join", {
  //       senderId: currentUserId,
  //       receiverId,
  //     });
  //     sockets.emit("getPreviousMessages", {
  //       senderId: currentUserId,
  //       receiverId,
  //     });
  //   }
  //   return () => {
  //     sockets.emit("leftRoom", { sender: currentUserId });
  //   };
  // }, [location.search, dispatch, currentUserId, receiverId]);

  // useEffect(() => {
  //   sockets.on("message", ({ data }) => {
  //     setMessages((prev) => [...prev, data.user]);
  //   });

  // sockets.on("startTyping", () => {s
  //   console.log("start typing");
  // });

  // sockets.on("stopTyping", () => {
  //   console.log("stop typing");
  // });

  // sockets.on("previousMessages", (previousMessages) => {
  //   setMessages(previousMessages);
  // });

  // return () => {
  //   sockets.off("message");
  // sockets.off("startTyping");
  // sockets.off("stopTyping");
  //     sockets.off("previousMessages");
  //   };
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (value && socket) {
      socket.emit("sendMessage", {
        message: value,
        receiverId,
      });
    }
    setValue("");
  };

  const onEmojiClick = (emojiData: { emoji: string }) => {
    console.log(emojiData);
    if (emojiData && emojiData.emoji) {
      setValue(value + emojiData.emoji);
    } else {
      console.error("Emoji is undefined");
    }
  };

  const toggleEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <Box
      sx={{
        border: "3px solid grey",
        borderRadius: 2,
        padding: 2,
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        gap: 2,
      }}
    >
      {/* <Drawer
        anchor="left"
        open={isDrawerOpen}
        // onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "300px",
            marginLeft: `${headerWidth}px`,
          },
        }}
      > */}
      <Box>
        <Box>
          {rooms?.length ? (
            <List>
              {rooms.map((room) => (
                <ListItem key={room._id}>
                  {receiver && (
                    <Box onClick={() => handleUserClick(receiver)}>
                      <Avatar
                        // onClick={() => navigate(`/profile/${receiver._id}`)}
                        sx={{ cursor: "pointer" }}
                        src={avatarUrl}
                      />
                      <ListItemText primary={username} />
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="h6">No rooms</Typography>
          )}
        </Box>
      </Box>
      {/* </Drawer> */}
      <Box
        sx={{
          border: "1px solid grey",
          borderRadius: 2,
          padding: 2,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        {!receiverId ? (
          <Typography variant="h6">Select a user to start chat</Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ width: "50%", textAlign: "center" }}
                type="text"
                placeholder="Write your Message"
                value={value}
                onChange={handleChange}
                onKeyUp={handleKeyPress}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <MainButton type="submit" buttonText="Send Message" />
              </Box>
            </Stack>
          </form>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
            justifyContent: "center",
          }}
        >
          <Card
            sx={{
              padding: 5,
              width: "50%",
              textAlign: "left",
              height: "300px",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map(({ text }, i) => (
              <div key={i}>
                {/* <strong>{username}</strong> */}
                {text}
              </div>
            ))}
          </Card>

          <Card
            sx={{
              padding: 5,
              width: "50%",
              textAlign: "left",
              height: "300px",
              overflow: "auto",
            }}
          >
            <Picker onEmojiClick={onEmojiClick} />
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatPage;
