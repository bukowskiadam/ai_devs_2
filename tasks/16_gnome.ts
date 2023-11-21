import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("gnome");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  msg: string;
  hint: string;
  url: string;
};

const solver = async (args: InputData) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: `${args.msg}, ${args.hint}` },
          {
            type: "image_url",
            image_url: {
              url: args.url,
            },
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
};

console.log(await task.solve(solver));
