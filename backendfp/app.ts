import express from "express";
// import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { runApp } from "./db/index";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
import roomRouter from "./routes/room";
import messageRouter from "./routes/message";
import notificationRouter from "./routes/notifications";
import authenticateJWT from "./middleWares/authMiddleWare";
import { User } from "./models/userModel";
import { Request, Response, NextFunction, RequestHandler } from "express";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 4001;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/notification", notificationRouter);
app.use("/room", roomRouter);
app.use("/message", messageRouter);

interface JwtPayload {
  id: string;
  username: string;
}

interface CustomRequest extends Request {
  user?: JwtPayload;
}

app.get(
  "/api/verify-token",
  authenticateJWT,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId).select("-password"); // исключаем пароль
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
        return;
      }
      res.json(user);
      return;
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      res.status(500).json({ message: "Ошибка сервера" });
      return;
    }
  }
);

runApp(() => {
  app.listen(port, async () => {
    console.log(`Server is running at port : ${port}`);
  });
});
