import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.moderations.create({
  input: "I'm just testing the moderation endpoint.",
});

console.log(JSON.stringify(response, null, 2));
