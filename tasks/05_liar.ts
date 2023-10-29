import OpenAI from "openai";

import { TaskPost } from "../lib/TaskPost";

const task = new TaskPost("liar");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const question = "What is the color of the sky?";

const solver = async (args: { answer: string }) => {
  const system = `Return YES or NO if the following text is an answer for the question: ${question}. Answer: `;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: system,
      },
      { role: "user", content: args.answer },
    ],
  });

  return response.choices[0].message.content;
};

console.log(await task.solve({ question }, solver));
