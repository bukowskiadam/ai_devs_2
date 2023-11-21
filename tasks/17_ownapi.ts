import { Task } from "../lib/Task";

const task = new Task("ownapi");

const solver = async () => {
  // spin up the server `bun tasks/17_ownapi-server.ts` and expose it via ngrok. Paste ngrok url below
  return "";
};

console.log(await task.solve(solver));
