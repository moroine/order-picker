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

  test("should list orders", async () => {
    const result = await controller({
      body: { name: "Moroine" },
    });
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(
      fixture?.orders.all.map((o) => ({
        _id: o._id.toString(),
        clientName: fixture?.clients.idToClient[o.client.toString()].name,
        status: o.status,
      }))
    );
  });
});
