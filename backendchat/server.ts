import http from "http";
import express from "express";
// import io from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import roomRouter from "./routes/auth";
import cors from "cors";
import { Server } from "socket.io";
import { initializedSocket } from "./socket";

dotenv.config({ path: ".env" });
const port = 4003;
const uri = process.env.MONGO_URI;

const app = express();
app.use(cors({ origin: "*" }));
app.use("/room", roomRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializedSocket(io);

mongoose
  .connect(uri!, {})
  .then(() => {
    console.log("Mongoose Database connected successfully");
  })
  .catch((error) => {
    console.log("Mongoose connection failed:", error);
  });

server.listen(port, () => {
  console.log(`server runs port ${port}`);
});
