import type { TokenResponse } from "./types";

const apiUrl = process.env.AIDEVS_API_URL;

export class Task {
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

  async getInput<InputData>(): Promise<InputData> {
    await this.authorize();

    if (!this.token) {
      throw new Error("Cannot get input without a token");
    }

    const inputResponse = await fetch(`${apiUrl}/task/${this.token}`);

    return inputResponse.json();
  }

  async submit<AnswerResponseData>(answer: any): Promise<AnswerResponseData> {
    const answerResponse = await fetch(`${apiUrl}/answer/${this.token}`, {
      method: "post",
      body: JSON.stringify({
        answer,
      }),
    });

    return answerResponse.json();
  }
}
