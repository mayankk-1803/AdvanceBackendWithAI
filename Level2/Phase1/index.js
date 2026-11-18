import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import User from "./models/user.model.js";
import Redis from "ioredis";

dotenv.config();
const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello, from Redis !!",
  });
});

//create user

app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  await redis.del("users:all")
  const user = await User.create({
    name,
    email,
    password
  })
  return res.status(201).json({
    message: "User created successfully",
    user
  });
});

//without redis

app.get("/users", async (req, res) => {
  const users = await User.find();
  return res.status(200).json({
    message: "Users retrieved successfully",
    users
  });
});


// with redis
app.get("/get-users-with-redis", async (req, res) => {
   const cached = await redis.get("users:all");
   if(cached){
    return res.status(200).json({
        message: "Users retrieved successfully from cache",
        users: JSON.parse(cached)
    });
   }
   const users = await User.find({});
   await redis.set("users:all", JSON.stringify(users))

   return res.status(200).json({
    message: "Users retrieved successfully",
    users
  });
})

app.listen(PORT, () => {
  connectDB();  
  console.log(`Server is running on port ${PORT}`);
});