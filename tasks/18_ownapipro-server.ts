import { serve } from "bun";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
type Input = {
  question: string;
};

const database: string[] = [];

const getDatabaseContext = () =>
  database.length
    ? ` Here is some additional context you may use to answer questions: ${database.join(
        "; "
      )}`
    : "";

const STORE_KEYWORD = "store-data";
const getAnswer = async (question: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: `Answer the question. If the message from user is not a question say "${STORE_KEYWORD}" and nothing more.${getDatabaseContext()}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
};

serve({
  async fetch(request) {
    try {
      const data = await request.json<Input>();
      console.log(data);

      const reply = await getAnswer(data.question);
      console.log(reply);

      if (reply === STORE_KEYWORD) {
        database.push(data.question);
        return Response.json({ reply: "Thanks, I'll remember it" });
      }

      return Response.json({ reply });
    } catch (error) {
      return new Response("Bad input", { status: 400 });
    }
  },
});
