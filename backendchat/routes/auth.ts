import { Router } from "express";
import { getOrCreateRoom, showRooms } from "../controllers/auth";

const router = Router();

router.get("/showAll", showRooms);

// router.post("/login", loginController, authenticateJWT);

export default router;
