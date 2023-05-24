import { MainFixture, initMainFixture } from "../../fixtures/main";
import { controller } from "./handler";
import mongoose from "mongoose";

describe("list-orders handler", () => {
  let fixture: MainFixture | null = null;

  beforeAll(async () => {
    fixture = await initMainFixture();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  test("should view order", async () => {
    const order = fixture?.orders.ordersClientA[0];
    const result = await controller({
      pathParameters: { orderId: order?._id.toString() ?? "" },
    });
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      _id: order?._id.toString() ?? "",
      card: [
        {
          product: {
            _id: fixture?.products.KeyNeticV1?._id.toString(),
            name: "KeyNetic",
            ref: "KeyNetic_V1",
            version: 1,
          },
          qty: 1,
        },
      ],
      clientName: "Client A",
      status: "pending",
    });
  });
});
