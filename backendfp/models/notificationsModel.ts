import { Document, Schema, model } from "mongoose";

export enum NotificationType {
  Like = "like",
  Comment = "comment",
  Follow = "follow",
  Message = "message",
}

export interface INotification extends Document {
  userId: string;
  senderId: string;
  type: NotificationType;
  postId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, ref: "User" },
  senderId: { type: String, required: true, ref: "User" },
  type: { type: String, required: true, enum: Object.values(NotificationType) },
  postId: { type: String, ref: "Post" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema
);
