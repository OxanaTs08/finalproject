import { Server } from "socket.io";
// import { getOrCreateRoom, handleUserLeave } from "./controllers/auth";
import { authenticateUser } from "./utils/auth";
import { IMessage, Message } from "./models/messageModel";
import { IRoom, Room } from "./models/roomModel";
import { Document } from "mongoose";
import { IUser, User } from "./models/userModel";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const connectedUsers: Set<string> = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  let currentUserId: string | null = null;
  let chatRoom: string | null = null;

  socket.on(
    "join",
    async ({ username, senderId }: { username: string; senderId: string }) => {
      currentUserId = senderId;
      socket.join(currentUserId);
      console.log("Current user ID in join in app:", currentUserId);
      console.log("Current username in join in app:", username);
    }
  );

  socket.on("selectedtUser", async ({ receiverId }: { receiverId: string }) => {
    if (!currentUserId && !receiverId) {
      console.log("user is not in a chat room");
      return;
    }

    console.log("Current user ID in server:", currentUserId);
    console.log("Receiver ID in server:", receiverId);

    let room = await Room.findOne({
      users: { $all: [currentUserId, receiverId] },
    });

    console.log("receiver id in app", receiverId);

    if (!room) {
      room = new Room({
        users: [currentUserId, receiverId],
        messages: [],
      });
      await room.save();
    }

    console.log("Room:", room);

    if (room && room._id) {
      chatRoom = room._id.toString();
      socket.join(chatRoom);
    }

    const previousMessages = await Message.find({ room: chatRoom }).populate(
      "sender",
      "username"
    );
    socket.emit("previousMessages", previousMessages);

    socket.on("sendMessage", async ({ message }: { message: string }) => {
      if (!chatRoom || !currentUserId) {
        console.log("user is not in a chat room");
        return;
      }
      const newMessage = new Message({
        room: chatRoom,
        sender: currentUserId,
        content: message,
      });
      await newMessage.save();

      await Room.findByIdAndUpdate(chatRoom, {
        $push: { messages: newMessage._id },
      });
      io.to(chatRoom).emit("message", {
        data: {
          user: {
            name: currentUserId,
            message,
          },
        },
      });
    });

    socket.on("leftRoom", async () => {
      if (currentUserId && chatRoom) {
        socket.leave(chatRoom);
        handleUserLeave(currentUserId);
      }
    });
  });
});

async function handleUserLeave(currentUserId: string) {
  connectedUsers.delete(currentUserId);

  const user = await User.findById(currentUserId);
  if (user) {
    io.emit("message", {
      data: {
        user: {
          username: user.username,
          message: `${user.username} has left the chat`,
        },
      },
    });
  }
}
