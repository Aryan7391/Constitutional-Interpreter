import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleQuery } from "./services/reasoningController";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/query", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const result = await handleQuery(query);
    res.json(result);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});