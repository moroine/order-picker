import { controller } from "./handler";

describe("hello handler", () => {
  test("should say hello", async () => {
    await expect(
      controller(
        {
      body: { name: "Moroine" }
    }
    )).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: "Hello Moroine, welcome to the exciting Serverless world!" })
    });
  });
});
