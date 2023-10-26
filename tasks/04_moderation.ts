import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("moderation");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const solver = async (args: { input: string[] }) => {
  const response = await openai.moderations.create({ input: args.input });

  return response.results.map(({ flagged }) => (flagged ? 1 : 0));
};

console.log(await task.solve(solver));
