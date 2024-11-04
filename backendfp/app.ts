import express from "express";
// import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { runApp } from "./db/index";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

dotenv.config({ path: ".env" });
const port = process.env.PORT || 4001;

runApp(() => {
  app.listen(port, async () => {
    console.log(`Server is running at port : ${port}`);
  });
});
