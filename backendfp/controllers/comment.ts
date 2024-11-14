import { User, IUser } from "../models/userModel";
import { Post, IPost } from "../models/postModel";
import { Comment, IComment } from "../models/commentModel";
import dotenv from "dotenv";
import { RequestHandler, Request, Response } from "express";
dotenv.config({ path: ".env" });

interface CustomRequest extends Request {
  user?: IUser;
}

export const createComment = async (req: CustomRequest, res: Response) => {
  try {
    const { postId, text } = req.body;
    if (!text) {
      res.status(400).json({ message: "text is required" });
      return;
    }
    const post = await Post.findById(postId);
    if (!postId) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newComment = await Comment.create({
      text,
      user: userId,
      post: postId,
    });
    await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: newComment._id,
      },
    });
    res
      .status(201)
      .json({ message: "Comment is created successfully", newComment });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while creating post" });
    return;
  }
};

export const showAllComments = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { postId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const comments = await Comment.find({ post: postId }).populate("user");
    res.status(201).json({ comments: comments });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching posts" });
    return;
  }
};

export const deleteComment = async (req: CustomRequest, res: Response) => {
  try {
    const { postId, id } = req.body;
    if (!id) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    console.log(id);
    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.user.toString() !== userId) {
      res
        .status(403)
        .json({ message: "You can only delete your own comments" });
      return;
    }

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    await Post.findByIdAndUpdate(postId, {
      $pull: {
        comments: deletedComment._id,
      },
    });
    res
      .status(200)
      .json({ message: "Comment is deleted successfully", deletedComment });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while deleting comment" });
  }
};

export const updateComment = async (req: CustomRequest, res: Response) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ message: "Text is required" });
      return;
    }
    if (!postId || !commentId) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      text,
    });
    res
      .status(200)
      .json({ message: "comment is updated successfully", updatedComment });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while updating comment" });
    return;
  }
};
