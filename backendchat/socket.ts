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
    console.log("A user connected:", socket.id);
    console.log("Connected users:", connectedUsers);

    let currentUserId: string | null = null;
    let chatRoom: string | null = null;

    socket.on(
      "join",
      ({ username, senderId }: { username: string; senderId: string }) => {
        currentUserId = senderId;
        socket.join(currentUserId);
        console.log("Current user ID in join in app:", currentUserId);
        console.log("Current username in join in app:", username);
      }
    );

    socket.on(
      "selectedtUser",
      async ({ receiverId }: { receiverId: string }) => {
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

        const previousMessages = await Message.find({
          room: chatRoom,
        }).populate("sender", "username");

        socket.emit("previousMessages", previousMessages);

        socket.on(
          "sendMessage",
          async ({
            message,
            receiverId,
            senderId,
            chatRoom,
          }: {
            message: string;
            receiverId: string;
            senderId: string;
            chatRoom: string;
          }) => {
            console.log("mesage from front", message);
            console.log("receiverId from front", receiverId);
            console.log("chatroom from front", chatRoom);
            console.log("sender from front", senderId);
            if (!chatRoom || !currentUserId) {
              console.log("user is not in a chat room");
              return;
            }
            try {
              const newMessage = new Message({
                receiver: receiverId,
                sender: currentUserId,
                text: message,
                room: chatRoom,
              });
              await newMessage.save();

              await Room.findByIdAndUpdate(chatRoom, {
                $push: { messages: newMessage._id },
              });
              io.to(chatRoom).emit("message", {
                data: newMessage,
              });
            } catch (error) {
              console.error("Error saving message:", error);
            }
          }
        );

        socket.on("leftRoom", async () => {
          if (currentUserId && chatRoom) {
            socket.leave(chatRoom);
            handleUserLeave(io, currentUserId);
          }
        });
      }
    );
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
          message: `${user.username} has left the chat`,
        },
      },
    });
  }
}
