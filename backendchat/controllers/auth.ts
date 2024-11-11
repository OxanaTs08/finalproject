import { Room } from "../models/roomModel";
import { Message } from "../models/messageModel";
import { Server } from "socket.io";
import { RequestHandler, Request, Response } from "express";

export const getOrCreateRoom = async (req: Request, res: Response) => {
  const { senderId, receiverId, messages } = req.body;
  try {
    let room = await Room.findOne({ users: { $all: [senderId, receiverId] } });

    if (!room) {
      room = new Room({
        users: [senderId, receiverId],
        messages: [],
      });
      const newRoom = await Room.create({
        users: [senderId, receiverId],
        messages: [],
      });
      return newRoom;
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const showRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    let rooms = await Room.find({ users: { $in: [userId] } });

    res.status(201).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "error while fetching rooms" });
    return;
  }
};

export const handleUserLeave = async (
  userId: string,
  io: Server,
  connectedUsers: Set<string>
) => {
  connectedUsers.delete(userId);

  io.emit("message", {
    data: {
      user: {
        // username,
        message: "user left chat",
        // `${user.username} has left the chat`,
      },
    },
  });
};
