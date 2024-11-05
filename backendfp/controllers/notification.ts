import { User, IUser } from "../models/userModel";
import { Post, IPost } from "../models/postModel";
import {
  Notification,
  INotification,
  NotificationType,
} from "../models/notificationsModel";
import dotenv from "dotenv";
import { RequestHandler, Request, Response } from "express";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
dotenv.config({ path: ".env" });

interface CustomRequest extends Request {
  user?: IUser;
}

export const createNotification = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, postId, type } = req.body;
    if (!postId || !type) {
      res.status(400).json({ message: "missing data" });
      return;
    }
    if (!Object.values(NotificationType).includes(type as NotificationType)) {
      res.status(400).json({ message: "Invalid notification type." });
      return;
    }
    const currentUserId = req.user?.id;
    console.log(currentUserId);

    if (!currentUserId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(currentUserId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newNotification = await Notification.create({
      userId,
      senderId: currentUserId,
      type,
      postId,
      isRead: false,
    });

    res.status(201).json({
      message: "Notification is created successfully",
      newNotification,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while creating notification" });
    return;
  }
};
