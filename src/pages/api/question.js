import OpenAI from "openai";
import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

  try {
    const completionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: question }],
      max_tokens: 10,
      temperature: 0.5,
      n: 1
    });

    const answer = completionResponse.data.choices[0].text.trim();

    const insertResult = await query(
      'INSERT INTO data(question, answer) VALUES($1, $2) RETURNING *', 
      [question, answer]
    );

    res.status(200).json({ question, answer, dbResult: insertResult.rows[0] });
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
};

