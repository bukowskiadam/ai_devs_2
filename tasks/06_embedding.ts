import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("embedding");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  input: Array<string>;
  question: string;
};

const solver = async (args: InputData) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: "Hawaiian pizza",
  });

  return response.data[0].embedding;
};

console.log(await task.solve(solver));
