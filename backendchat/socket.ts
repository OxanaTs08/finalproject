import { Server, Socket } from "socket.io";
// import { getOrCreateRoom, handleUserLeave } from "./controllers/auth";
import { authenticateUser } from "./utils/auth";
import { IMessage, Message } from "./models/messageModel";
import { IRoom, Room } from "./models/roomModel";
import { Document } from "mongoose";
import { IUser, User } from "./models/userModel";

const connectedUsers: Set<string> = new Set();

export const initializedSocket = (io: Server) => {
  io.on("connection", async (socket): Promise<void> => {
    socket.on("join", async ({ currentUserId, receiverId }) => {
      console.log(
        "currentUserId, receiverId in joinRoom",
        currentUserId,
        receiverId
      );
      let room = await Room.findOne({
        users: { $all: [currentUserId, receiverId] },
      });

      console.log("excisting room", room);

      if (!room) {
        room = new Room({
          users: [currentUserId, receiverId],
          messages: [],
        });
        await room.save();
        console.log("Room created successfully:", room);
      }

      console.log("Room:", room);

      socket.join(room?._id as string);
    });

    socket.on("sendMessage", async ({ message, sender, receiver, room }) => {
      console.log("Message received in sendMessage:", message);
      const newMessage = new Message({
        text: message,
        sender: sender,
        receiver: receiver,
        room: room,
      });
      await newMessage.save();
      console.log("Message saved:", newMessage);

      await Room.findByIdAndUpdate(room, {
        $push: { messages: newMessage._id },
      });

      io.to(room).emit("message", {
        text: message,
        sender,
        receiver: receiver,
        room: room,
      });

      console.log("Emitting message event with data:", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      connectedUsers.delete(socket.id);
    });
  });
};
