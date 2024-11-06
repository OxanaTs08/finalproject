import { Router } from "express";
import {
  registerController,
  loginController,
  showAllUsers,
  showUserById,
  toFollow,
  showOwnFollowings,
  showownFollowers,
  deleteFollower,
  // deleteFollowing,
  showYourLikes,
  showAllExceptCurrentUser,
  // logoutController,
  showUser,
} from "../controllers/user";
import authenticateJWT from "../middleWares/authMiddleWare";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/showall", authenticateJWT, showAllUsers);
router.get(
  "/showallexceptcurrentuser",
  authenticateJWT,
  showAllExceptCurrentUser
);
router.get("/:id", authenticateJWT, showUserById);
router.post("/showone/bybody", authenticateJWT, showUser);
router.put("/following/tofollow", authenticateJWT, toFollow);
router.get("/following/ownfollowing", authenticateJWT, showOwnFollowings);
router.get("/followers/ownfollowers", authenticateJWT, showownFollowers);
// router.put("/deletefollowing/:followingId", authenticateJWT, deleteFollowing);
router.put("/deletefollower/:followerId", authenticateJWT, deleteFollower);
router.get("/userlikes/yourlikes", authenticateJWT, showYourLikes);
// router.get("/logout", authenticateJWT, logoutController);
export default router;
