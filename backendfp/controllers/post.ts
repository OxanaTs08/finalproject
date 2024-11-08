import { User, IUser } from "../models/userModel";
import { Post, IPost } from "../models/postModel";
import dotenv from "dotenv";
import { RequestHandler, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
dotenv.config({ path: ".env" });

interface CustomRequest extends Request {
  user?: IUser;
}

// export const createPost = async (req: CustomRequest, res: Response) => {
//   try {
//     const { content, images } = req.body;
//     if (!content || !images) {
//       res.status(400).json({ message: "content and images are required" });
//       return;
//     }

//     const userId = req.user?.id;

//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized in auth" });
//       return;
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     const newPost = await Post.create({
//       content,
//       images,
//       user: userId,
//     });
//     await User.findByIdAndUpdate(userId, {
//       $push: {
//         posts: newPost._id,
//       },
//     });
//     res.status(201).json({ message: "Post is created successfully", newPost });
//     return;
//   } catch (error: any) {
//     res.status(500).json({ message: "Error while creating post" });
//     return;
//   }
// };

export const createPost = async (req: CustomRequest, res: Response) => {
  try {
    const { content, images } = req.body;
    if (!content || !images || !Array.isArray(images) || images.length === 0) {
      res.status(400).json({ message: "content and images are required" });
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

    const uploadedImageUrls: string[] = [];
    for (const base64Image of images) {
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "posts",
        resourse_type: "image",
      });
      uploadedImageUrls.push(result.url);
    }

    const newPost = await Post.create({
      content,
      images: uploadedImageUrls,
      user: userId,
    });
    await User.findByIdAndUpdate(userId, {
      $push: {
        posts: newPost._id,
      },
    });
    res.status(201).json({ message: "Post is created successfully", newPost });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while creating post" });
    return;
  }
};

export const showAllPosts = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
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
    const posts = await Post.find({ user: { $ne: userId } });
    res.status(201).json({ posts });
    return;
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

export const showOwnPosts = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId).populate("posts");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.posts.length === 0) {
      res
        .status(200)
        .json({ message: "No posts created by you", posts: user.posts });
      return;
    }
    res.status(200).json({ message: "Your posts", posts: user.posts });
    return;
  } catch (error: any) {
    res.status(500).send(error.message);
    return;
  }
};

export const postById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const user = await User.findById(userId).populate("posts");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: `Post with ${id} not found` });
      return;
    } else {
      res.status(200).json({ message: "Post fetched successfully", post });
      return;
    }
  } catch (error: any) {
    console.error("Error while fetching post:", error.message);
    res.status(500).json({ message: "Error while fetching post" });
    return;
  }
};

export const postByUser = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized in auth" });
      return;
    }

    const anotheruser = await User.findById(id);
    if (!anotheruser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await Post.find({ user: id });
    if (posts.length === 0) {
      res.status(200).json({ message: `No posts created by user ${id}` });
      return;
    }
    res.status(200).json({ message: `post of user ${id}`, posts });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching posts" });
    return;
  }
};

export const postsByFollowings = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  console.log(userId);
  try {
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
    const followings = user.followings || [];
    console.log(followings);

    if (Array.isArray(followings) && followings.length === 0) {
      res.status(200).json({ message: "No followings added by you" });
      return;
    }

    const posts = await Post.find({ user: { $in: followings } }).populate(
      "user"
    );
    if (posts.length === 0) {
      res.status(200).json({ message: "No posts found" });
      return;
    }
    res.status(200).json({ posts });
    return;
  } catch (error) {
    res.status(500).json({ message: "error while fetching posts in catch" });
    return;
  }
};

export const deletePost = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
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

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.user.toString() !== userId) {
      res.status(403).json({ message: "You can only delete your own posts" });
      return;
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    await User.findByIdAndUpdate(userId, {
      $pull: {
        posts: deletedPost._id,
      },
    });
    res
      .status(200)
      .json({ message: "Post is deleted successfully", deletedPost });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while deleting post" });
    return;
  }
};

export const updatePost = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content, images } = req.body;
    if (!content || !images) {
      res.status(400).json({ message: "Content and imagess are required" });
      return;
    }
    if (!id) {
      res.status(400).json({ message: "Id is required" });
      return;
    }
    const updatedPost = await Post.findByIdAndUpdate(id, {
      content,
      images,
    });
    res
      .status(200)
      .json({ message: "Post is updated successfully", updatedPost });
    return;
  } catch (error: any) {
    res.status(500).json({ message: "Error while updating post" });
    return;
  }
};

// export const createLike = async (req: CustomRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { postId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "user not found" });
//       return;
//     }
//     const post = await Post.findById(postId);
//     if (!post) {
//       res.status(404).json({ message: "Post not found" });
//       return;
//     }

//     if (!post.likes.includes(user.id)) {
//       await Post.findByIdAndUpdate(postId, {
//         $push: {
//           likes: user._id,
//         },
//       });
//       await User.findByIdAndUpdate(userId, {
//         $push: {
//           yourLikes: post._id,
//         },
//       });

//       res.status(201).json({
//         message: "Like is put successfully",
//         post,
//         user,
//       });
//       return;
//     } else {
//       await Post.findByIdAndUpdate(postId, {
//         $pull: {
//           likes: user._id,
//         },
//       });
//       await User.findByIdAndUpdate(userId, {
//         $pull: {
//           yourLikes: post._id,
//         },
//       });
//       res
//         .status(200)
//         .json({ message: "Like is deleted successfully", post, user });
//       return;
//     }
//   } catch (error) {
//     res.status(500).json({ message: error });
//     return;
//   }
// };

export const createLike = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.body;
    console.log("postid in controller", postId);

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (!post.likes.includes(user.id)) {
      await Post.findByIdAndUpdate(postId, {
        $push: {
          likes: user._id,
        },
      });
      await User.findByIdAndUpdate(userId, {
        $push: {
          yourLikes: post._id,
        },
      });

      res.status(201).json({
        message: "Like is put successfully",
        post,
        user,
      });
      return;
    } else {
      await Post.findByIdAndUpdate(postId, {
        $pull: {
          likes: user._id,
        },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: {
          yourLikes: post._id,
        },
      });
      res
        .status(200)
        .json({ message: "Like is deleted successfully", post, user });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.error(error);
    return;
  }
};

// export const deleteLike = async (req: CustomRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { postId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
//     const post = await Post.findById(postId);
//     if (!post) {
//       res.status(404).json({ message: "Post not found" });
//       return;
//     }
//     if (!post.likes.includes(user.id)) {
//       res.status(400).json({ message: "You have not liked a post" });
//       return;
//     }

//     await Post.findByIdAndUpdate(postId, {
//       $pull: {
//         likes: user._id,
//       },
//     });
//     await User.findByIdAndUpdate(userId, {
//       $pull: {
//         yourLikes: post._id,
//       },
//     });
//     res.status(200).json({ message: "Like is deleted successfully" });
//     return;
//   } catch (error) {
//     res.status(500).json({ message: error });
//     return;
//   }
// };

export const showAllPostLikes = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const post = await Post.findById(id).populate("likes");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    const likeCount = post.likes.length;
    const UsersWhoLiked = post.likes;
    res.status(200).json({
      message: "Likes fetched successfully",
      likeCount,
      UsersWhoLiked,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const savePost = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

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

    if (user.savedPosts.includes(post.id)) {
      res.status(400).json({ message: "You have already saved a post" });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $push: {
        savedPosts: post._id,
      },
    });
    await Post.findByIdAndUpdate(postId, {
      $push: {
        savedBy: user._id,
      },
    });
    res.status(201).json({
      message: "post is savd successfully",
      post,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const deleteSavedPost = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

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
    if (!user.savedPosts.includes(post.id)) {
      res.status(400).json({ message: "You have not saved this post" });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $pull: {
        savedPosts: post._id,
      },
    });
    await Post.findByIdAndUpdate(postId, {
      $pull: {
        savedBy: user._id,
      },
    });

    res.status(200).json({ message: "Post is deleted successfullyfrom saved" });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

export const showAllPostSaves = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("savedBy");
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    const savesCount = post.savedBy.length;
    const UsersWhoSaved = post.savedBy;
    res.status(200).json({
      message: "List of SavdBy fetched successfully",
      savesCount,
      UsersWhoSaved,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};
