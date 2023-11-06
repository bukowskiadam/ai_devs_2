import { Task } from "../lib/Task";
import { ChatCompletionCreateParams } from "openai/resources/index.mjs";

const task = new Task("functions");

const solver = (): ChatCompletionCreateParams.Function => ({
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
