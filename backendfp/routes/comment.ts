import { Router } from "express";
import {
  createComment,
  showAllComments,
  deleteComment,
  updateComment,
} from "../controllers/comment";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/createcomment/", authenticateJWT, createComment);
router.get("/showallcomment", authenticateJWT, showAllComments);
router.delete("/delete/:postId/:id", authenticateJWT, deleteComment);
router.put("/updatecomment", authenticateJWT, updateComment);

export default router;
