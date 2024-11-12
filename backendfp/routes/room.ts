import { Router } from "express";
import { CreateRoom, showRooms } from "../controllers/room";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/createroom", authenticateJWT, CreateRoom);
router.get("/showall", authenticateJWT, showRooms);

export default router;
