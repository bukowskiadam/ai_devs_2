import OpenAI from "openai";

import { Task } from "../lib/Task";
import db from "./13_people.json";
import { debug } from "../lib/debug";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const task = new Task("people");

type InputData = {
  question: string;
};

const systemPrompt = `Your goal is to extract information from question.
Q: co lubi jeść Tomek Bzik?
A: { "imie": "Tomasz", "nazwisko": "Bzik" }
Q: Jaki jest ulubiony serial Agaty Kaczki?
A: { "imie": "Agata", "nazwisko": "Kaczka" }
Q: Ulubiony kolor Agi Rozkaz, to?
A: { "imie": "Agnieszka", "nazwisko": "Rozkaz" }`;

const solver = async ({ question }: InputData): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Q: ${question}\nA: `,
      },
    ],
  });

  debug("GPT Guessed person:", response.choices[0].message.content);

  let who: { imie: string; nazwisko: string };
  try {
    who = JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    throw new Error("Invalid JSON: " + response.choices[0].message.content, {
      cause: error,
    });
  }

  const record = db.find(
    ({ imie, nazwisko }) => who.imie === imie && who.nazwisko === nazwisko
  );

  if (!record) {
    throw new Error(`Can't find person: ${JSON.stringify(who)}`);
  }

  const answerResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: `Having the below knowledge about the person answer the question.\n###${JSON.stringify(
          record
        )}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return answerResponse.choices[0].message.content ?? `I don't know`;
};

console.log(await task.solve(solver));
