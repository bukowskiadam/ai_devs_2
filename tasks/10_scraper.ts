import OpenAI from "openai";

import { Task } from "../lib/Task";

const task = new Task("scraper");

type InputData = {
  msg: string;
  input: string;
  question: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const betterFetch = async (url: string): Promise<string> => {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19041";

  let retries = 5;
  while (retries--) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": userAgent },
      });

      if (response.status === 200) {
        return response.text();
      } else {
        console.error("Response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching text content:", error);
    }
  }

  throw new Error("Retries limit reached");
};

const solver = async ({ input, question, msg }: InputData) => {
  try {
    const text = await betterFetch(input);

    console.log({ text });

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `${msg}\n\n###\n${text}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching text content", error);
  }
};

console.log(await task.solve(solver));
