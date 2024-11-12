import { Router } from "express";
import { CreateRoom, showRooms } from "../controllers/auth";

const router = Router();

router.get("/showAll", showRooms);
// router.post("/createroom", CreateRoom);

// router.post("/login", loginController, authenticateJWT);

export default router;
