import express from "express"

const app = express();
const PORT=5000

app.get("/", (req,res) =>{
    return res.json({message: " Hello from Level 4"})
})

app.listen(PORT, ()=>{
    console.log("Server Started");
})