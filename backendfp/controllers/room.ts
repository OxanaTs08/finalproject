import { IRoom, Room } from "../models/roomModel";
import { RequestHandler, Request, Response } from "express";
import { IUser } from "../models/userModel";

interface CustomRequest extends Request {
  user?: IUser;
}

export const CreateRoom = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;

    const existingRoom = await Room.findOne({
      users: { $all: [senderId, receiverId] },
    });

    if (existingRoom) {
      res
        .status(400)
        .json({ message: "Room already exists", room: existingRoom });
      return;
    }

    const newRoom = await Room.create({
      users: [senderId, receiverId],
      messages: [],
    });
    res.status(201).json({ message: "Room is created successfully", newRoom });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while creating room" });
    return;
  }
};

export const showRooms = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
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
