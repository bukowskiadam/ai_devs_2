import OpenAI from "openai";

import { Task } from "../lib/Task";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const task = new Task("blogger");

const solver = async (input: { blog: string[] }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Napisz wpis na bloga (w języku polskim) na temat przyrządzania pizzy Margherity. Jako wejście otrzymasz spis 4 rozdziałów, które muszą pojawić się we wpisie. Jako odpowiedź musisz zwrócić tablicę (w formacie JSON) złożoną z 4 pól reprezentujących te cztery rozdziały, np.: ["tekst 1","tekst 2","tekst 3","tekst 4"]`,
      },
      { role: "user", content: JSON.stringify(input.blog) },
    ],
  });

  return JSON.parse(response.choices[0].message.content!);
};

console.log(await task.solve(solver));
