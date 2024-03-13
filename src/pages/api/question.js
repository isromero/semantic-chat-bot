import OpenAI from "openai";
import { query } from "@/lib/db";

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

const getEmbedding = async (question) => {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question,
    encoding_format: 'float'
  });
  console.log(embedding.data[0].embedding)
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
    const completionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [{ role: "user", content: question }],
      max_tokens: 10,
      temperature: 0.5,
      n: 1
    });
    const answer = completionResponse.choices[0].message.content;
    const embedding = (await getEmbedding(question));

    const insertResult = await query(
      'INSERT INTO data(question, answer, embedding) VALUES($1, $2, $3) RETURNING *', 
      [question, answer, '[' + embedding + ']']
    );

    res.status(200).json({ question, answer, dbResult: insertResult.rows[0] });
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
};

