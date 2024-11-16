import { Server, Socket } from "socket.io";
// import { getOrCreateRoom, handleUserLeave } from "./controllers/auth";
import { authenticateUser } from "./utils/auth";
import { IMessage, Message } from "./models/messageModel";
import { IRoom, Room } from "./models/roomModel";
import { Document } from "mongoose";
import { IUser, User } from "./models/userModel";

const connectedUsers: Set<string> = new Set();

export const initializedSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id); //отрабатывает
    let currentUserId: string | null = null;
    let chatRoom: string | null = null;

    socket.on(
      "join",
      async ({
        username,
        avatarUrl,
        senderId,
      }: {
        username: string;
        avatarUrl: string;
        senderId: string;
      }) => {
        if (!senderId) {
          console.error("senderId is missing in join");
          return;
        }
        currentUserId = senderId;
        socket.join(currentUserId);
        console.log("Current user ID in join in app:", currentUserId);
        console.log("Current username in join in app:", username);
        console.log("Current avvatarUrl in join in app:", avatarUrl);
      }
    );

    socket.on("selectedtUser", async ({ receiverId }) => {
      console.log("receiverId in selectedtUser", receiverId);
      console.log("currentUserId in selectedtUser", currentUserId);
      if (!currentUserId || !receiverId) {
        console.error("currentUserId or receiverId is missing");
        return;
      }
      console.log(
        "Creating or finding room for users:",
        currentUserId,
        receiverId
      );

      let room = await Room.findOne({
        users: { $all: [currentUserId, receiverId] },
      });

      console.log("receiver id in app", receiverId); //отрабатывает

      if (!room) {
        room = new Room({
          users: [currentUserId, receiverId],
          messages: [],
        });
        await room.save();
        console.log("Room created successfully:", room);
      }

      console.log("Room:", room);

      if (room && room._id) {
        chatRoom = room._id.toString();
        socket.join(chatRoom);
      }

      const previousMessages = await Message.find({ room: chatRoom }).populate(
        "sender",
        "username avatarUrl"
      );
      // console.log("Previous messages:", previousMessages);//отрабатывает
      socket.emit("previousMessages", previousMessages);

      socket.on("sendMessage", async ({ message }) => {
        if (!chatRoom || !currentUserId) {
          console.log("user is not in a chat room or sender is missing");
          return;
        }
        if (!message) {
          console.error("message text is missing");
          return;
        }

        const user = await User.findById(currentUserId);

        const newMessage = new Message({
          room: chatRoom,
          sender: currentUserId,
          text: message,
          receiver: receiverId,
        });
        await newMessage.save();

        await Room.findByIdAndUpdate(chatRoom, {
          $push: { messages: newMessage._id },
        });

        // io.to(chatRoom).emit("message", {
        //   text: message,
        //   sender: currentUserId,
        // });

        console.log("Sending message:", {
          user: {
            username: user?.username,
            avatarUrl: user?.avatarUrl,
            message: message,
          },
        });
        io.to(chatRoom).emit("message", {
          data: {
            user: {
              username: user?.username,
              avatarUrl: user?.avatarUrl,
              message: message,
            },
          },
        });
      });

      socket.on("leftRoom", async () => {
        if (currentUserId && chatRoom) {
          socket.leave(chatRoom);
          handleUserLeave(io, currentUserId);
        }
      });
    });
  });
};

async function handleUserLeave(io: Server, currentUserId: string) {
  connectedUsers.delete(currentUserId);

  const user = await User.findById(currentUserId);
  if (user) {
    io.emit("message", {
      data: {
        user: {
          username: user.username,
          avatarUrl: user.avatarUrl,
          message: `${user.username} has left the chat`,
        },
      },
    });
  }
}
