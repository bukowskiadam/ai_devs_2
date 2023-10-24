import { Task } from "../lib/Task";

const task = new Task("helloapi");

const data = await task.getInput<{ cookie: string }>();
console.log(await task.submit(data.cookie));
