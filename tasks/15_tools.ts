import OpenAI from "openai";

import { Task } from "../lib/Task";
import { waitForInput } from "../lib/readline";

const task = new Task("tools");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  question: string;
};

const date = new Date().toISOString().split("T")[0];
const systemMessage = `
Today is: ${date}
Decide whether the task should be added to the ToDo list or to the calendar (if time is provided) and return the corresponding JSON.
Always use YYYY-MM-DD format for dates.

example for ToDo: "Przypomnij mi, że mam kupić mleko = {\"tool\":\"ToDo\",\"desc\":\"Kup mleko\"}
example for Calendar: "Jutro mam spotkanie z Marianem = {\"tool\":\"Calendar\",\"desc\":\"Spotkanie z Marianem\",\"date\":\"2023-11-18\"},
`;

const solver = async (args: InputData) => {
  console.log("Enter to confirm / Ctrl-C to exit");
  await waitForInput();

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      { role: "system", content: systemMessage },
      {
        role: "user",
        content: args.question,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content || "");
};

console.log(await task.solve(solver));
