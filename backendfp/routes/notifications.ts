import { Router } from "express";
import { createNotification } from "../controllers/notification";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/create", authenticateJWT, createNotification);
export default router;
