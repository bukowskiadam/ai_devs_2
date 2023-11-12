import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

import { Task } from "../lib/Task";
import { debug } from "../lib/debug";

const COLLECTION_NAME = "unknow_news";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });

const task = new Task("search");

type InputData = { question: string };
const solver = async ({ question }: InputData) => {
  const { embedding } = (
    await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: question,
    })
  ).data[0];

  const results = await qdrant.search(COLLECTION_NAME, {
    vector: embedding,
    limit: 1,
  });

  debug("results", results);

  if (!results.length) {
    throw new Error("No match");
  }

  return results[0].payload?.url;
};

console.log(await task.solve(solver));
