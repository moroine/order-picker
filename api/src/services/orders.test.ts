import mongoose from "mongoose";
import { getOrder, listOrders } from "./orders";
import { MainFixture, initMainFixture } from "../fixtures/main";

describe("orders", () => {
  let fixture: MainFixture | null = null;

  beforeAll(async () => {
    fixture = await initMainFixture();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe("listOrders", () => {
    test("should returns all entries", async () => {
      const orders = await listOrders();
      expect(orders).toEqual(
        fixture?.orders.all.map((o) => ({
          _id: o._id,
          clientName: fixture?.clients.idToClient[o.client.toString()].name,
          status: o.status,
        }))
      );
    });
  });

  describe("getOrder", () => {
    test("should returns all entries", async () => {
      const order = fixture?.orders.ordersClientA[0];
      const orderDetails = await getOrder(order?._id.toString() ?? "");
      expect(orderDetails).toEqual({
        _id: order?._id.toString() ?? "",
        card: [
          {
            product: {
              _id: fixture?.products.KeyNeticV1?._id,
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
});
