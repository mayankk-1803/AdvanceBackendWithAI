import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

dotenv.config();
const app = express();


const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello, from Redis !!",
  });
});

app.listen(PORT, () => {
  connectDB();  
  console.log(`Server is running on port ${PORT}`);
});