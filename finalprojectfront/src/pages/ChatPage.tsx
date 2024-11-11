import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
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
import { IUser, userById } from "../redux/userSlice";
import { IRoom, showRooms } from "../redux/roomSlice";

interface IMessage {
  sender: string;
  receiver: string;
  text: string;
  createdAt: Date;
}

const sockets = io("http://localhost:4003");

function ChatPage() {
  const dispatch = useAppDispatch();
  const [receiverId, setReceiverId] = useState<string | null>(null);
  // const [searchParams, setSearchParams] = useState({});
  const location = useLocation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [value, setValue] = useState("");
  // const [showEmoji, setShowEmoji] = useState(false);
  const navigate = useNavigate();

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );

  // const users = useSelector((state: RootState) => state.users);
  const rooms: IRoom[] | null = useSelector(
    (state: RootState) => state.rooms.rooms
  );

  useEffect(() => {
    const locationPath = location.pathname;
    if (locationPath.includes("/chatpage") && currentUserId) {
      dispatch(showRooms());
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    const locationPath = location.pathname;
    if (locationPath.includes("/chatpage") && currentUserId && receiverId) {
      dispatch(userById(receiverId));
      sockets.emit("join", {
        senderId: currentUserId,
        receiverId,
      });
      sockets.emit("getPreviousMessages", {
        senderId: currentUserId,
        receiverId,
      });
    }
    return () => {
      sockets.emit("leftRoom", { sender: currentUserId });
    };
  }, [location.search, dispatch, currentUserId, receiverId]);

  useEffect(() => {
    sockets.on("message", ({ data }) => {
      setMessages((prev) => [...prev, data.user]);
    });

    // sockets.on("startTyping", () => {s
    //   console.log("start typing");
    // });

    // sockets.on("stopTyping", () => {
    //   console.log("stop typing");
    // });

    sockets.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    return () => {
      sockets.off("message");
      // sockets.off("startTyping");
      // sockets.off("stopTyping");
      sockets.off("previousMessages");
    };
  }, []);

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
    if (value) {
      sockets.emit("sendMessage", {
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

  // const toggleEmoji = () => {
  //   setShowEmoji(!showEmoji);
  // };

  const handleUserClick = (selectedUser: IUser) => {
    setReceiverId(selectedUser._id);
    navigate(`/ChatPage/${selectedUser._id}`, {
      state: { receiverId: selectedUser._id },
    });

    console.log("Emitting selectedUser with receiverId:", receiverId);
    sockets.emit("selectedtUser", {
      receiverId: selectedUser._id,
    });
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
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        // onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "300px",
            marginLeft: `${headerWidth}px`,
          },
        }}
      >
        <Box>
          {rooms?.length ? (
            <List>
              {rooms?.map((room: IRoom) => {
                const receiver = room.users.find(
                  (user: IUser) => user._id !== currentUserId
                );
                return (
                  receiver && (
                    <ListItem key={room._id}>
                      <Box onClick={() => handleUserClick(receiver)}>
                        <Avatar
                          onClick={() => navigate(`/profile/${receiver?._id}`)}
                          sx={{ cursor: "pointer" }}
                          src={receiver?.avatarUrl}
                        />
                        <ListItemText primary={receiver.username} />
                      </Box>
                    </ListItem>
                  )
                );
              })}
            </List>
          ) : (
            <Typography variant="h6">No rooms</Typography>
          )}
        </Box>
      </Drawer>
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
