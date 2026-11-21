import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => {
  return res.json({ message: "Hello from Level 4" });
});

app.get("/what-is-js", async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b", 
      messages: [
        {
          role: "user",
          content: "What is JS?",
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "";
    return res.json({ answer });
  } catch (error) {
    console.error("Groq API error:", error);
    return res.status(500).json({ error: "Failed to generate response from Groq" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});