import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const uri = process.env.MONGO_URI as string;
// ?? "mongodb://localhost:27017/finalproject";

export const runApp = async (callback: () => void) => {
  mongoose
    .connect(uri, {})
    .then(() => {
      console.log("Mongoos Database connected successfully");
      callback();
    })
    .catch((error: Error) => {
      console.log("Mongoose connection failed:", error);
    });
};
