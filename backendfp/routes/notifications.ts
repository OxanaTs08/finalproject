import { Router } from "express";
import {
  createNotification,
  showNotifications,
} from "../controllers/notification";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/create", authenticateJWT, createNotification);
router.get("/showall", authenticateJWT, showNotifications);
export default router;
