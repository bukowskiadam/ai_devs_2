import { Task } from "../lib/Task";

const task = new Task("meme");

type InputData = {
  image: string;
  text: string;
};

const BASE_PATH = import.meta.dir + "/output";

Bun.serve({
  port: 3000,
  async fetch(req) {
    console.log("someone requested", req.url);
    const filePath = BASE_PATH + new URL(req.url).pathname;
    const file = Bun.file(filePath);
    return new Response(file.stream());
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

const solver = async ({ image, text }: InputData) => {
  const output = "image.jpg";
  const { stdout, stderr } = Bun.spawn([
    `${import.meta.dir}/19_make-meme.sh`,
    image,
    text,
    `${import.meta.dir}/output/${output}`,
  ]);
  const stdoutStr = await new Response(stdout).text();
  const stderrStr = await new Response(stderr).text();
  console.log("STDOUT:", stdoutStr, ", STDERR:", stderrStr);

  // TODO: run `ngrok http 3000` and fill the address below
  const ngrokHost = "";

  return `${ngrokHost}/${output}`;
};

console.log(await task.solve(solver));
