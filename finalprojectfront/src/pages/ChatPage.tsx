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
    username: string;
    avatarUrl: string;
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

  useEffect(() => {
    if (currentUserId && receiverId) {
      console.log("Connected to the server", currentUserId, receiverId);
      sockets.emit("join", {
        username: username,
        avatarUrl: avatarUrl,
        senderId: currentUserId,
      });
      sockets.emit("getPreviousMessages", {
        sender: currentUserId,
        receiver: receiverId,
      });
    }
    return () => {
      sockets.emit("leftRoom", receiverId);
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    sockets.on("message", ({ data }) => {
      console.log("Message received:", data);
      setMessages((prev) => [
        ...prev,
        {
          text: data.user.message,
          user: {
            username: data.user.username || "unknown",
            avatarUrl: data.user.avatarUrl || "",
          },
        },
      ]);
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

  const handleSubmit = () => {
    if (value) {
      sockets.emit("sendMessage", {
        message: value,
        //new added
        username,
        avatarUrl,
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
    setReceiverChat(selectedUser);
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
                  onClick={() => handleUserClick(receiverinRooms)}
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
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {messages.map((message, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    alignSelf:
                      message.user?.username === username
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Avatar
                    sx={{ cursor: "pointer", width: 30, height: 30 }}
                    src={message.user?.avatarUrl || ""}
                  />
                  {/* <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                {message.user?.username || "unknown"}
              </Typography> */}
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor:
                        message.user.username === username
                          ? "#EFEFEF"
                          : "#4D00FF",
                      padding: "10px",
                      borderRadius: "20px",
                      width: "50%",
                    }}
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

    // <Box
    //   sx={{
    //     border: "3px solid grey",
    //     borderRadius: 2,
    //     padding: 2,
    //     height: "100vh",
    //     display: "flex",
    //     flexDirection: "row",
    //     gap: 2,
    //   }}
    // >
    //   <Box>
    //     <Box>
    //       {rooms?.length ? (
    //         <List>
    //           {rooms.map((room) => {
    //             const receiverinRooms: IUser | undefined = room?.users.find(
    //               (user: IUser) => user._id !== currentUserId
    //             );
    //             if (!receiverinRooms) return null;
    //             return (
    //               <ListItem key={room._id}>
    //                 <Box onClick={() => handleUserClick(receiverinRooms)}>
    //                   <Avatar
    //                     onClick={() =>
    //                       navigate(`/profile/${receiverinRooms._id}`)
    //                     }
    //                     sx={{ cursor: "pointer" }}
    //                     src={receiverinRooms.avatarUrl}
    //                   />
    //                   <ListItemText primary={receiverinRooms.username} />
    //                 </Box>
    //               </ListItem>
    //             );
    //           })}
    //         </List>
    //       ) : (
    //         <Typography variant="h6">No rooms</Typography>
    //       )}
    //     </Box>
    //   </Box>
    //   <Box
    //     sx={{
    //       border: "1px solid grey",
    //       borderRadius: 2,
    //       padding: 2,
    //       height: "90vh",
    //       display: "flex",
    //       flexDirection: "column",
    //       gap: 2,
    //       justifyContent: "space-between",
    //       width: "80%",
    //     }}
    //   >
    //     {!receiverId ? (
    //       <Typography variant="h6">Select a user to start chat</Typography>
    //     ) : (
    //       <>
    //         <Typography variant="h6">
    //           Write message to {receiverChat?.username || "user"}
    //         </Typography>
    //         <form onSubmit={handleSubmit}>
    //           <Stack
    //             sx={{
    //               display: "flex",
    //               flexDirection: "column",
    //               gap: 2,
    //               alignItems: "center",
    //             }}
    //           >
    //             <TextField
    //               sx={{ width: "50%", textAlign: "center" }}
    //               type="text"
    //               placeholder="Write your Message"
    //               value={value}
    //               onChange={handleChange}
    //               onKeyUp={handleKeyPress}
    //             />
    //             <Box
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "row",
    //                 gap: 2,
    //                 justifyContent: "center",
    //               }}
    //             >
    //               <MainButton type="submit" buttonText="Send Message" />
    //             </Box>
    //           </Stack>
    //         </form>
    //       </>
    //     )}
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         gap: 6,
    //         justifyContent: "center",
    //       }}
    //     >
    //       <Card
    //         sx={{
    //           padding: 5,
    //           width: "50%",
    //           textAlign: "left",
    //           height: "300px",
    //           overflow: "auto",
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: 2,
    //         }}
    //       >
    //         {messages.map((message, i) => (
    //           <Box key={i}>
    //             <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
    //               {message.user?.username || "unknown"}
    //             </Typography>
    //             <Avatar
    //               sx={{ cursor: "pointer" }}
    //               src={message.user?.avatarUrl || ""}
    //             />
    //             <Typography variant="body1">{message.text}</Typography>
    //           </Box>
    //         ))}
    //       </Card>

    //       <Card
    //         sx={{
    //           padding: 5,
    //           width: "50%",
    //           textAlign: "left",
    //           height: "300px",
    //           overflow: "auto",
    //         }}
    //       >
    //         <Picker onEmojiClick={onEmojiClick} />
    //       </Card>
    //     </Box>
    //   </Box>
    // </Box>
  );
}

export default ChatPage;
