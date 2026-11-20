import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) =>{
    return res.status(200).json({
        message: "Hello, from Gateway Service!!",
    });
})

app.use("/auth", proxy("http://localhost:8001"))
app.use("/order", proxy("http://localhost:8002"))
app.use("/product", proxy("http://localhost:8003"))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});