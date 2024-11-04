import { Router } from "express";
import {
  createComment,
  showAllComments,
  deleteComment,
  updateComment,
} from "../controllers/comment";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/create/:id", authenticateJWT, createComment);
router.get("/showall/:id", authenticateJWT, showAllComments);
router.delete("/delete/:postId/:id", authenticateJWT, deleteComment);
router.put("/update/:postId/:commentId", authenticateJWT, updateComment);

export default router;
