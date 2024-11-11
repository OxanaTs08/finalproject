import mongoose, { Document, Schema, Model } from "mongoose";
interface IRoom extends Document {
  users: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema: Schema<IRoom> = new Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room: Model<IRoom> = mongoose.model<IRoom>("Room", roomSchema);

export { Room, IRoom };
