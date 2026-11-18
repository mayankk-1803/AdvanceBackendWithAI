import express from "express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import User from "./models/user.model.js";
import Redis from "ioredis";
import rateLimitter from "./middleware/ratelimit.js";
import emailQueue from "./queue.js";


dotenv.config();
const app = express();
export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
const PORT = process.env.PORT || 8000;

app.use(express.json());
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

  await emailQueue.add("send-email", {email});

  return res.status(201).json({
    message: "User created successfully",
    user
  });
});

//without redis

app.get("/users", rateLimitter ,async (req, res) => {
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


// redis otp service
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // to store in redis
  await redis.set(`otp:${email}`, otp, "EX",30);
  return res.json({otp})
})

// verify otp
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const cachedOtp = await redis.get(`otp:${email}`);
  if(!cachedOtp){
    return res.status(400).json({message:"otp is expired or not found"})
  }

  if(cachedOtp != otp){
    return res.status(400).json({message:"incorrect otp"})
  }
  await redis.del(`otp:${email}`);
  return res.json({message: "otp veriified !!!"})
})

app.listen(PORT, () => {
  connectDB();  
  console.log(`Server is running on port ${PORT}`);
});