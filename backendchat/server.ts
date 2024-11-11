import http from "http";
import express from "express";
// import io from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import roomRouter from "./routes/auth";
import cors from "cors";
import { Server } from "socket.io";
import { Socket } from "socket.io";

dotenv.config({ path: ".env" });
const port = 4003;
const uri = process.env.MONGO_URI;

const app = express();
app.use(cors({ origin: "*" }));
app.use("/room", roomRouter);

const server = http.createServer(app);

mongoose
  .connect(uri!, {})
  .then(() => {
    console.log("Mongoose Database connected successfully");
  })
  .catch((error) => {
    console.log("Mongoose connection failed:", error);
  });

server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
