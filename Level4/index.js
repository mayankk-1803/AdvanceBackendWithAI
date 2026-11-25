import express from "express";
import dotenv from "dotenv";
// import Groq from "groq-sdk";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { Annotation, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt"

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
    const prompt = req.body?.prompt || req.query.prompt || "What is JS?";
    const response = await graph.invoke({ prompt });
    console.log("Final full state:", response);
    return res.status(200).json({ aiMsg: response.aiMsg });
  } catch (err) {
    console.error("Graph error:", err);
    return res.status(500).json({ error: "Failed to generate response" });
  }
});

// Langgraph
// Custom state
// const State = Annotation.Root({
//   prompt: Annotation,
//   aiMsg: Annotation
// })

//Tool nodes
const tools = []
const toolNode = new ToolNode(tools)


const callLLM =async (state) => {
  console.log("state:" , state);
  
  const response = await model.invoke([
    {
      role: "system",
      content:"You are jarvis"
    },
    {
      role:"human",
      content: state.prompt
    }
  ])

  return {message: [response]}
}

const shouldContinue = async () => {
  
}


const graph = new StateGraph(MessagesAnnotation)
.addNode("agent", callLLM)
.addNode("tools", toolNode)
.addEdge("__start__", "agent")
.addEdge("toold", "agent")
.addConditionalEdges("agent", shouldContinue)
.compile()



app.get("/", (req, res) => {
  return res.json({ message: "Hello from Level 4" });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});