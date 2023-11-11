import OpenAI from "openai";

import { Task } from "../lib/Task";
import { debug } from "../lib/debug";

const task = new Task("whoami");

type InputData = {
  hint: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let hints: string[] = [];

async function guess(): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: `Based on the facts about the person guess who is that. Use only information provided and if you don't know simply say "no". As the answer return only the name.`,
      },
      {
        role: "user",
        content: hints.map((h) => `- ${h}`).join("\n"),
      },
    ],
  });

  const { content } = response.choices[0].message;

  return content === "no" ? null : content;
}

const solve = async (): Promise<unknown> => {
  const { hint } = await task.getInput<InputData>();

  hints.push(hint);

  debug({ hints });

  const answer = await guess();

  debug({ answer });

  if (!answer) {
    return solve();
  }

  return task.submit(answer);
};

console.log(await solve());
