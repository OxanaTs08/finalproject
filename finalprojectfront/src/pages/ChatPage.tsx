import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Picker from "emoji-picker-react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  ListItem,
  List,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import MainButton from "../components/MainButton";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { IUser } from "../redux/userSlice";
import { IRoom, showRooms } from "../redux/roomSlice";
// import { IMessage } from "../redux/messageSlice";

interface Response {
  error?: string;
}
const sockets = io("http://localhost:4003");

interface IMessage {
  text: string;
  user: {
    id: string;
  };
}

function ChatPage() {
  const dispatch = useAppDispatch();
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverChat, setReceiverChat] = useState<IUser | null>(null);
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

  const currentUser: IUser | null = useSelector(
    (state: RootState) => state.users.currentUser || null
  );
  console.log("currentUser in chat page", currentUser);

  useEffect(() => {
    dispatch(showRooms());
  }, [dispatch]);

  const rooms: IRoom[] | null = useSelector(
    (state: RootState) => state.rooms.rooms || []
  );

  useEffect(() => {
    if (currentUserId && receiverId) {
      sockets.emit("join", {
        currentUserId,
        receiverId,
      });
    }
    console.log("Connected to the server", currentUserId, receiverId);
    return () => {
      sockets.off("joinRoom");
      sockets.off("message");
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    sockets.on("message", (data) => {
      console.log("Message received in useeffect:", data);
      setMessages((prev) => [
        ...prev,
        {
          text: data.text,
          user: {
            id: data.sender,
            // username: data.sender.username,
            // avatarUrl: data.sender.avatarUrl,
          },
        },
      ]);
    });

    return () => {
      sockets.off("message");
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const avatarUrl = useSelector(
    (state: RootState) => state.users.currentUser?.avatarUrl
  );
  console.log("avatarUrl in chat page", avatarUrl);
  const username = useSelector(
    (state: RootState) => state.users.currentUser?.username
  );
  console.log("username in chat page", username);

  const handleUserClick = (selectedUser: IUser, room: IRoom) => {
    setReceiverId(selectedUser?._id);
    setReceiverChat(selectedUser);
    setChatRoom(room?._id);
    console.log("receiverId in handleUserClick:", receiverId);
    console.log("room in handleUserClick:", chatRoom);
    navigate(`/ChatPage/${selectedUser._id}`, {
      state: { receiverId: selectedUser._id },
    });
  };

  const handleSubmit = () => {
    console.log("click");
    console.log(
      "sender, receiver, room in handleSubmit",
      currentUserId,
      receiverId,
      chatRoom
    );
    if (value) {
      sockets.emit("sendMessage", {
        message: value,
        sender: currentUserId,
        receiver: receiverId,
        room: chatRoom,
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "25% 75%",
        gap: 2,
      }}
    >
      {/* rooms */}
      <Box sx={{ borderRight: "1px solid #EFEFEF", overflowY: "auto" }}>
        {rooms?.length ? (
          <List sx={{ height: "100%", overflowY: "auto" }}>
            {rooms.map((room) => {
              const receiverinRooms: IUser | undefined = room?.users.find(
                (user: IUser) => user._id !== currentUserId
              );
              if (!receiverinRooms) return null;
              return (
                <ListItem
                  key={room._id}
                  onClick={() => handleUserClick(receiverinRooms, room)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "10px",
                    "&:hover": { backgroundColor: "#EFEFEF" },
                  }}
                >
                  <Avatar
                    onClick={() => navigate(`/profile/${receiverinRooms._id}`)}
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
              );
            })}
          </List>
        ) : (
          <Typography variant="h6">No rooms</Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/*headeer*/}
        {/*receiver*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #EFEFEF",
          }}
        >
          {receiverChat && (
            <>
              <Avatar
                src={receiverChat.avatarUrl}
                sx={{ width: 40, height: 40, marginRight: 2 }}
              />
              <Typography variant="h6">
                {receiverChat?.username || "user"}
              </Typography>
            </>
          )}
        </Box>
        {!receiverId ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Please select a user to start chatting
            </Typography>
          </Box>
        ) : (
          <>
            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                padding: "10px 20px",
                overflowY: "auto",
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {messages.map((message, i) => (
                <Box
                // key={i}
                // sx={{
                //   display: "flex",
                //   alignItems: "center",
                //   gap: 2,
                //   alignSelf:
                //     message.user?.username === username
                //       ? "flex-end"
                //       : "flex-start",
                // }}
                >
                  <Typography
                  // variant="body1"
                  // sx={{
                  //   backgroundColor:
                  //     message.user.username === username
                  //       ? "#EFEFEF"
                  //       : "#4D00FF",
                  //   padding: "10px",
                  //   borderRadius: "20px",
                  //   maxWidth: "70%",
                  //   wordWrap: "break-word",
                  // }}
                  >
                    {message.text}
                  </Typography>
                </Box>
              ))}
            </Box>
            {/* Input */}
            <Stack
              sx={{
                borderTop: "1px solid #EFEFEF",
                padding: "10px 20px",
                display: "flex",
                alignItenss: "center",
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                placeholder="Write your Message..."
                value={value}
                onChange={handleChange}
                onKeyUp={handleKeyPress}
                sx={{
                  backgrundColor: "#f1f2f6",
                  borderRadius: "30px",
                  width: "100%",
                  textAlign: "center",
                }}
                type="text"
              />
              <MainButton
                type="submit"
                buttonText="Send"
                onClick={handleSubmit}
              />
              {/* emoji */}
              <Box
                sx={{
                  // maxHeight: showEmoji ? "300px" : "100px", // Одна строка или полный список?
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <Picker onEmojiClick={onEmojiClick} />
                {/* <Button onClick={toggleEmoji}>
                  {showEmoji ? "Hide" : "More Emojis"}
                </Button> */}
              </Box>
              {/* {showEmoji && <Picker onEmojiClick={onEmojiClick} />} */}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}

export default ChatPage;
