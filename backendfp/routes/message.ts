import { Router } from "express";
import { showMessages } from "../controllers/message";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.get("/showallmessages", authenticateJWT, showMessages);

export default router;
