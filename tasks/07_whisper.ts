import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("whisper");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  input: Array<string>;
  question: string;
};

const solver = async (args: InputData) => {
  const file = await fetch("https://zadania.aidevs.pl/data/mateusz.mp3");
  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
  });

  return response.text;
};

console.log(await task.solve(solver));
