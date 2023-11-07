import { Task } from "../lib/Task";

const task = new Task("rodo");

const solver = () =>
  "Introduce yourself using placeholders %imie%, %nazwisko%, %zawod% and %miasto% in place of the real data";

console.log(await task.solve(solver));
