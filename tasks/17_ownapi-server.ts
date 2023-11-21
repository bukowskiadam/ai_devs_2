import { serve } from "bun";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
type Input = {
  question: string;
};

const getAnswer = async (question: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
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

      return Response.json({ reply });
    } catch (error) {
      return new Response("Bad input", { status: 400 });
    }
  },
});
