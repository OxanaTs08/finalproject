import mongoose, { Document, Schema, Model } from "mongoose";

interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  content?: string;
  images: string[];
  likes: mongoose.Types.ObjectId[];
  savedBy: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema<IPost> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: 2200,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true, // добавляет поля createdAt и updatedAt
  }
);

const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

export { Post, IPost };
