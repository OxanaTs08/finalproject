import mongoose, { Document, Schema, Model } from "mongoose";

interface IStory extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  createdAt: Date;
  expiresAt: Date;
}

const storySchema: Schema<IStory> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Story: Model<IStory> = mongoose.model<IStory>("Story", storySchema);

export { Story, IStory };
