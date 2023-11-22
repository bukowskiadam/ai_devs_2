import { Task } from "../lib/Task";

const task = new Task("ownapipro");

const solver = async () => {
  // spin up the server `bun tasks/18_ownapipro-server.ts` and expose it via ngrok. Paste ngrok url below
  return "";
};

console.log(await task.solve(solver));
