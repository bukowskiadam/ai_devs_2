import { Task } from "../lib/Task";

const task = new Task("helloapi");

const solver = (input: { cookie: string }) => input.cookie;

console.log(await task.solve(solver));
