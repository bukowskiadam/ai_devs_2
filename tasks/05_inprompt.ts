import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("inprompt");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  input: Array<string>;
  question: string;
};

const solver = async (args: InputData) => {
  const nameResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Who is mentioned in the following question? Do not answer the question. Just provide the name. If you don't know say I don't know.",
      },
      {
        role: "user",
        content: `Question: ${args.question}\nName in question: `,
      },
    ],
  });

  const name = nameResponse.choices[0].message.content;

  if (!name) {
    throw new Error(`Can't find the name in the question`);
  }

  const input = args.input.filter((s) => s.includes(name));

  console.log(input);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Having the following context: ###\n${input.join(
          "\n"
        )}### Answer the following question in Polish.`,
      },
      {
        role: "user",
        content: `Question: ${args.question}\nAnswer: `,
      },
    ],
  });

  return response.choices[0].message.content;
};

console.log(await task.solve(solver));
