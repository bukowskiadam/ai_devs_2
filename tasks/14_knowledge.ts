import OpenAI from "openai";

import { Task } from "../lib/Task";
import { debug } from "../lib/debug";

const task = new Task("knowledge");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  question: string;
};

const exchangeRateFunction: OpenAI.ChatCompletionTool = {
  type: "function",
  function: {
    name: "exchangeRate",
    description: "Get current exchange rate for multiple currencies",
    parameters: {
      type: "object",
      properties: {
        currency: {
          type: "string",
          description: "currency code (three letters)",
        },
      },
    },
  },
};

const populationFunction: OpenAI.ChatCompletionTool = {
  type: "function",
  function: {
    name: "population",
    description: "Get current population of the given country",
    parameters: {
      type: "object",
      properties: {
        country: {
          type: "string",
          description: "country code in cca2 format (two letter code)",
        },
      },
    },
  },
};

const getPopulation = async ({
  country,
}: {
  country: string;
}): Promise<number> => {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${country}`
  );
  const data = await response.json();

  return data[0]?.population;
};

const getExchangeRate = async ({
  currency,
}: {
  currency: string;
}): Promise<number> => {
  const response = await fetch(
    `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/?format=json`
  );
  const data = await response.json();

  return data.rates[0].mid;
};

const solver = async (args: InputData) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    tools: [exchangeRateFunction, populationFunction],
    messages: [
      {
        role: "user",
        content: args.question,
      },
    ],
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];

  debug(response.choices[0]);

  if (toolCall && toolCall.type === "function") {
    const args = JSON.parse(toolCall.function.arguments);

    switch (toolCall.function.name) {
      case "population":
        return getPopulation(args);
      case "exchangeRate":
        return getExchangeRate(args);
    }
  }

  // fallback answer
  return response.choices[0].message.content;
};

console.log(await task.solve(solver));
