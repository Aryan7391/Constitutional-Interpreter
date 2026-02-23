import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

export async function callGroq(prompt: string) {
  try {
    return await callModel(prompt, process.env.GROQ_MODEL!);
  } catch (error) {
    console.log("Primary model failed. Switching fallback...");
    return await callModel(prompt, "llama-3.1-70b-versatile");
  }
}

async function callModel(prompt: string, model: string) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model,
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        { role: "system", content: "You are a constitutional law expert providing structured legal analysis." },
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
}