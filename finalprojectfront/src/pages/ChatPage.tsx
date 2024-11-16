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
} from "@mui/material";
import MainButton from "../components/MainButton";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser } from "../redux/userSlice";
import { IRoom, showRooms } from "../redux/roomSlice";
import { IMessage } from "../redux/messageSlice";

interface Response {
  error?: string;
}
const sockets = io("http://localhost:4003");

// if (location.pathname.includes("/chatpage")) {
//   const sockets = io.connect("http://localhost:4003");
// }
// setSocket(newSocket);

function ChatPage() {
  const dispatch = useAppDispatch();
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [chatRoom, setChatRoom] = useState<string | null>(null);
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
  const room: IRoom | null = rooms.length > 0 ? rooms[0] : null;
  const receiver: IUser | undefined = room?.users.find(
    (user: IUser) => user._id !== currentUserId
  );

  const username = receiver?.username;
  const avatarUrl = receiver?.avatarUrl;
  // const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (currentUserId && receiverId) {
      console.log("Connected to the server", currentUserId, receiverId);
      sockets.emit("join", {
        username: receiverId,
        senderId: currentUserId,
      });
      sockets.emit("getPreviousMessages", {
        //а не должен ли быть тут on
        sender: currentUserId,
        receiver: receiverId,
      });
    }
    return () => {
      sockets.emit("leftRoom", receiverId);
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    sockets.on("message", (message: IMessage) => {
      console.log("Message received:", message);
      setMessages((prev) => [...prev, message]);
    });
    sockets.on("previousMessages", (previousMessages: IMessage[]) => {
      console.log("Previous messages received:", previousMessages);

      // setMessages((prev) => [...prev, ...previousMessages])
      setMessages(previousMessages);
    });
    return () => {
      sockets.off("message");
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
    console.log("Message sent:", value);
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

  const handleUserClick = (selectedUser: IUser) => {
    setReceiverId(selectedUser?._id);
    console.log("receiverId in handleUserClick:", receiverId);
    navigate(`/ChatPage/${selectedUser._id}`, {
      state: { receiverId: selectedUser._id },
    });
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
      <Box>
        <Box>
          {rooms?.length ? (
            <List>
              {rooms.map((room) => {
                const receiverinRooms: IUser | undefined = room?.users.find(
                  (user: IUser) => user._id !== currentUserId
                );
                if (!receiverinRooms) return null;
                return (
                  <ListItem key={room._id}>
                    <Box onClick={() => handleUserClick(receiverinRooms)}>
                      <Avatar
                        onClick={() =>
                          navigate(`/profile/${receiverinRooms._id}`)
                        }
                        sx={{ cursor: "pointer" }}
                        src={receiverinRooms.avatarUrl}
                      />
                      <ListItemText primary={receiverinRooms.username} />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography variant="h6">No rooms</Typography>
          )}
        </Box>
      </Box>
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
          <>
            <Typography variant="h6">
              Write message to {receiver?.username || "user"}
            </Typography>
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
          </>
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
              <Box key={i}>
                {/* <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {userName}
                </Typography> */}
                <Typography variant="body1">{text}</Typography>
              </Box>
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
