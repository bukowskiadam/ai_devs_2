import { debug } from "./debug";
import type { TokenResponse } from "./types";

const apiUrl = process.env.AIDEVS_API_URL;

export class TaskPost {
  private token: string = "";

  constructor(private taskId: string) {}

  private async authorize() {
    const tokenResponse = await fetch(`${apiUrl}/token/${this.taskId}`, {
      method: "post",
      body: JSON.stringify({
        apikey: process.env.AIDEVS_API_KEY,
      }),
    });

    const tokenData = await tokenResponse.json<TokenResponse>();

    if (tokenData.code !== 0) {
      throw new Error(tokenData.msg);
    }

    if (!tokenData.token) {
      throw new Error("missing token field data");
    }

    this.token = tokenData.token;
  }

  private async getInput<InputData>(
    data: Record<string, string>
  ): Promise<InputData> {
    await this.authorize();

    if (!this.token) {
      throw new Error("Cannot get input without a token");
    }

    const inputResponse = await fetch(`${apiUrl}/task/${this.token}`, {
      method: "post",
      body: new URLSearchParams(data),
    });

    return inputResponse.json();
  }

  private async submit<AnswerResponseData>(
    answer: any
  ): Promise<AnswerResponseData> {
    const answerResponse = await fetch(`${apiUrl}/answer/${this.token}`, {
      method: "post",
      body: JSON.stringify({
        answer,
      }),
    });

    return answerResponse.json();
  }

  async solve<InputData, AnswerResponseData>(
    data: Record<string, string>,
    solver: (
      input: InputData
    ) => AnswerResponseData | Promise<AnswerResponseData>
  ) {
    const input: InputData = await this.getInput(data);

    debug("Input data:", input);

    const answer = await solver(input);

    debug("Answer:", answer);

    return this.submit(answer);
  }
}
