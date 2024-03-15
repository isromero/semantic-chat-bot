import OpenAI from "openai";
import { query } from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
const SIMILARITY_RANGE = 0.9;

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, val, idx) => acc + val * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const getRowsOfDB = async() => {
  const result = await query(
    `SELECT question, answer, embedding FROM data;`
  )
  return result.rows;
};

const getEmbedding = async (question) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: question,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const actualEmbedding = await getEmbedding(question);
    const rowsDB = await getRowsOfDB();
    let answer = '';
    let isSimilar = false;

    for (const row of rowsDB) {
      const similarity = cosineSimilarity(actualEmbedding, JSON.parse(row.embedding));
      if (similarity > SIMILARITY_RANGE) {
        answer = row.answer;
        isSimilar = true;
        break;
      }
    }

    if (!isSimilar) {
      const completionResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [{ role: "user", content: question }],
        max_tokens: 99,
        temperature: 0.5,
        n: 1,
      });
      answer = completionResponse.choices[0].message.content;
      await query("INSERT INTO data(question, answer, embedding) VALUES($1, $2, $3) RETURNING *", [question, answer, '[' + actualEmbedding + ']']);
    }
    res.status(200).json({ question, answer });
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
};