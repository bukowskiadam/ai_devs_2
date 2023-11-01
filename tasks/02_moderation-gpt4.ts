import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("moderation");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const solver = async (args: { msg: string; input: string[] }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are moderating the sentences using openai moderation endpoint.
        ${args.msg}.
        For arguments like ["forbidden sentence", "good sentence"] return an array with [1, 0]`,
      },
      { role: "user", content: JSON.stringify(args.input) },
    ],
  });

  return JSON.parse(response.choices[0].message.content!);
};

console.log(await task.solve(solver));
