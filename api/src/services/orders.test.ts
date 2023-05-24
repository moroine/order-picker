import mongoose from "mongoose";
import { listOrders } from "./orders";
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
});
