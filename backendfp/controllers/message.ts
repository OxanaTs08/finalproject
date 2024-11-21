import { Message, IMessage } from "../models/messageModel";
import dotenv from "dotenv";
import { RequestHandler, Request, Response } from "express";
dotenv.config({ path: ".env" });

export const showMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      res.status(401).json({ message: "No room found" });
      return;
    }

    const messages = await Message.find({ room: roomId });
    res.status(201).json({ messages: messages });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching messages" });
    return;
  }
};
