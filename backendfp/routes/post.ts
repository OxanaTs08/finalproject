import { Router } from "express";
import {
  createPost,
  showAllPosts,
  showOwnPosts,
  postById,
  postByUser,
  deletePost,
  updatePost,
  createLike,
  showAllPostLikes,
  savePost,
  deleteSavedPost,
  showAllPostSaves,
  postsByFollowings,
} from "../controllers/post";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/create", authenticateJWT, createPost);
router.get("/showall", authenticateJWT, showAllPosts);
router.get("/showown", authenticateJWT, showOwnPosts);
router.get("/:id", authenticateJWT, postById);
router.get("/user/:id", authenticateJWT, postByUser);
router.get("/postsbyfollowings", authenticateJWT, postsByFollowings);
router.delete("/delete/:id", authenticateJWT, deletePost);
router.put("/update/:id", authenticateJWT, updatePost);
router.put("/like/:postId", authenticateJWT, createLike);
router.get("/likes/:id", authenticateJWT, showAllPostLikes);
router.put("/save/:postId", authenticateJWT, savePost);
router.put("/unsave/:postId", authenticateJWT, deleteSavedPost);
router.get("/saves/:id", authenticateJWT, showAllPostSaves);
export default router;
