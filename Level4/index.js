import express from "express";
import dotenv from "dotenv";
// import Groq from "groq-sdk";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// app.get("/what-is-js", async (req, res) => {
//   try {
//     const completion = await groq.chat.completions.create({
//       model: "openai/gpt-oss-20b", 
//       messages: [
//         {
//           role: "user",
//           content: "What is JS?",
//         },
//       ],
//     });

//     const answer = completion.choices[0]?.message?.content ?? "";
//     return res.json({ answer });
//   } catch (error) {
//     console.error("Groq API error:", error);
//     return res.status(500).json({ error: "Failed to generate response from Groq" });
//   }
// });

//with langchain

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, // Default value.
  model: "openai/gpt-oss-20b",
});

app.get("/what-is-js", async (req, res) => {
  try {
    const prompt = req.query.prompt || "What is JS?";
    const message = new HumanMessage(String(prompt));
    const response = await model.invoke([message]);

    return res.json({ answer: response.content });
  } catch (error) {
    console.error("LangChain / Groq error:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
});

app.get("/", (req, res) => {
  return res.json({ message: "Hello from Level 4" });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});