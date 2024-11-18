import { User, IUser } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import dotenv from "dotenv";
import { RequestHandler, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
dotenv.config({ path: ".env" });
import { sendEmail } from "../utils/sendMail";

const jwtSecret = process.env.JWT_SECRET || "";

interface CustomRequest extends Request {
  user?: IUser;
}

export const registerController: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ message: "Username and email and password are required" });
    return;
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: `User ${email}  already exists` });
      return;
    }

    const uniqueUsername = await User.findOne({ username });
    if (uniqueUsername) {
      res.status(400).json({ message: `username: ${username} exists` });
      return;
    }

    const hashRounds = 10;
    const hashedPassword = await bcrypt.hash(password, hashRounds);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created", user });
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: `Duplicate username: ${username}` });
      return;
    } else {
      res.status(500).json(error);
      return;
    }
  }
};

export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const foundUser = (await User.findOne({ email })) as IUser & {
      _id: string;
    };

    if (!foundUser) {
      res.status(400).send({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ id: foundUser._id.toString() }, jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user: await User.findById(foundUser._id) });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};

//нужен для refresh token
// export const logoutController = async (req: CustomRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       res.status(400).json({ message: "User id is missing in the token" });
//       return;
//     }
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       res.status(400).json({ message: "not logged in" });
//       return;
//     }
//     // await User.findByIdAndUpdate(userId, { $set: { online: false } });
//     res.status(200).json({ message: "User logged out" });
//   } catch (error) {
//     res.status(500).json({ message: "logout failed", error });
//     return;
//   }
// };

export const showAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

export const showAllExceptCurrentUser = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ message: "User id is missing in the token" });
      return;
    }
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json({ users });
    return;
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

export const showCurrentUser: RequestHandler = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user });
    return;
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

export const showUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

export const showUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ message: "User id is missing " });
      return;
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user });
    return;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).send(error.message);
    return;
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { username, avatarUrl, email, description } = req.body;

    if (!username && !avatarUrl && !email && !description) {
      res.status(400).json({ message: "At least one field is required" });
      return;
    }
    let uploadedImageUrl: string | undefined;
    if (avatarUrl) {
      uploadedImageUrl = avatarUrl;
      const result = await cloudinary.uploader.upload(avatarUrl, {
        folder: "avatars",
        resourse_type: "image",
      });
      uploadedImageUrl = result.url;
      req.body.avatarUrl = uploadedImageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(200).json({ updatedUser });
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

// export const toFollow = async (req: CustomRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { followingId } = req.params;

//     console.log("followingId:", followingId);

//     const following = await User.findById(followingId);
//     if (!following) {
//       res.status(404).json({ message: "Following not found" });
//       return;
//     }
//     //а если юзер просто в ленте?
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     if (user.followings.includes(following.id)) {
//       res
//         .status(400)
//         .json({ message: "Following already exists in your list" });
//       return;
//     }

//     await User.findByIdAndUpdate(userId, {
//       $push: {
//         followings: following._id,
//       },
//     });
//     await User.findByIdAndUpdate(followingId, {
//       $push: { followers: user._id },
//     });
//     const updatedUser = await User.findById(userId).populate("followings");

//     res.status(201).json({
//       message: "Following is added successfully",
//       user: updatedUser,
//       "your following": following,
//     });
//     return;
//   } catch (error) {
//     res.status(500).json({ message: error });
//     return;
//   }
// };

export const toFollow = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { followingId } = req.body;

    // console.log("followingId:", followingId);

    const following = await User.findById(followingId);
    if (!following) {
      res.status(404).json({ message: "Following not found" });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.followings.includes(following.id)) {
      // res
      //   .status(400)
      //   .json({ message: "Following already exists in your list" });
      // return;

      await User.findByIdAndUpdate(userId, {
        $pull: {
          followings: following._id,
        },
      });
      await User.findByIdAndUpdate(followingId, {
        $pull: { followers: userId },
      });

      const updatedUser = await User.findById(userId).populate("followings");
      res.status(201).json({
        message: "Following is deleted successfully",
        user: updatedUser,
        "Following deleted successfully": following,
      });
      return;
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          followings: following._id,
        },
      });
      await User.findByIdAndUpdate(followingId, {
        $addToSet: { followers: user._id },
      });
      const updatedUser = await User.findById(userId).populate("followings");

      res.status(201).json({
        message: "Following is added successfully",
        user: updatedUser,
        "your following": following,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const showOwnFollowings = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId).populate("followings");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.followings.length === 0) {
      res.status(200).json({ message: "No followings added by you" });
      return;
    }
    res
      .status(200)
      .json({ message: "Your followings", followings: user.followings });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching followings" });
    return;
  }
};

export const showownFollowers = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId).populate("followers");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.followers.length === 0) {
      res.status(200).json({ message: "No followers added by you" });
      return;
    }
    res
      .status(200)
      .json({ message: "Your followers", followers: user.followers });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching followers" });
    return;
  }
};

// export const deleteFollowing = async (req: CustomRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { followingId } = req.params;

//     const following = await User.findById(followingId);
//     if (!following) {
//       res.status(404).json({ message: "Following not found" });
//       return;
//     }

//     await User.findByIdAndUpdate(userId, {
//       $pull: {
//         followings: following._id,
//       },
//     });
//     await User.findByIdAndUpdate(followingId, {
//       $pull: { followers: userId },
//     });

//     const updatedUser = await User.findById(userId).populate("followings");
//     res.status(201).json({
//       message: "Following is deleted successfully",
//       user: updatedUser,
//       "Following deleted successfully": following,
//     });

//     return;
//   } catch (error) {
//     res.status(500).json({ message: error });
//     return;
//   }
// };

export const deleteFollower = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { followerId } = req.params;

    const follower = await User.findById(followerId);
    if (!follower) {
      res.status(404).json({ message: "Follower not found" });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $pull: {
        followers: follower._id,
      },
    });
    await User.findByIdAndUpdate(followerId, {
      $pull: { followings: userId },
    });

    res.status(200).json({ message: "Follower is deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const showYourLikes = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }
    const user = await User.findById(userId).populate("yourLikes");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.yourLikes.length === 0) {
      res.status(200).json({ message: "No posts liked by you" });
      return;
    }
    res.status(200).json({ message: "Your likes", yourLikes: user.yourLikes });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching your likes" });
    return;
  }
};

export const searchUsersByName = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username) {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });

    res.json({ message: "result of search", users });
    return;
  } catch (error) {
    res.status(500).json({ error: "Error white search" });
    return;
  }
};

export const resetPasswordLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 3600000);
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/changepassword/${resetToken}`;
    try {
      await sendEmail({
        from: process.env.EMAIL_SITE as string,
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      });
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      res.status(500).json({ message: "Error sending email" });
      return;
    }

    res.status(200).json({ message: "Password reset email sent" });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const createNewPassword = async (req: CustomRequest, res: Response) => {
  try {
    const { newPassword } = req.body;
    const resetPasswordToken = req.params.token;
    console.log("req.params.token", resetPasswordToken);

    if (!newPassword) {
      res.status(400).json({ error: "New Password is required" });
      return;
    }
    const user = await User.findOne({ resetPasswordToken });
    console.log("user", user);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.log("we make next step");

    if (
      user.resetPasswordExpire &&
      user.resetPasswordExpire.getTime() < Date.now()
    ) {
      res.status(400).json({ error: "Token Expired" });
      return;
    }
    console.log("we make next step 2");

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // await user.save();
    try {
      console.log("Saving user...");
      await user.save();
      console.log("User saved successfully");
    } catch (saveError: any) {
      console.error("Error while saving user:", saveError);
      res
        .status(500)
        .json({ error: `Error while saving user: ${saveError.message}` });
      return;
    }
    console.log("user after save", user);

    res.status(200).json({ message: "Password is changed successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Error while changing password" });
    return;
  }
};
