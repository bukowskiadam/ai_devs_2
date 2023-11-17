import { createInterface } from "node:readline/promises";

export const waitForInput = async (): Promise<string> => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.once("line", (line) => {
      rl.close();
      resolve(line);
    });
  });
};
