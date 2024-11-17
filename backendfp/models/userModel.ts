import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  avatarUrl?: string;
  description?: string;
  followers: mongoose.Types.ObjectId[];
  followings: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  savedPosts: mongoose.Types.ObjectId[];
  yourLikes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Password must contain at least 6 characters"],
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    avatarUrl: { type: String, default: null },
    description: { type: String, default: null },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    yourLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export { User, IUser };
