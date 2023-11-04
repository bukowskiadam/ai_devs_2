import OpenAI from "openai";

import { Task } from "../lib/Task";
import { ChatCompletionCreateParams } from "openai/resources/index.mjs";

const task = new Task("functions");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputData = {
  input: Array<string>;
  question: string;
};

const solver = (args: InputData): ChatCompletionCreateParams.Function => ({
  name: "addUser",
  description: "Adding a new user",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "first name",
      },
      surname: {
        type: "string",
        description: "surname",
      },
      year: {
        type: "integer",
        description: "year of birth",
      },
    },
  },
});

console.log(await task.solve(solver));
