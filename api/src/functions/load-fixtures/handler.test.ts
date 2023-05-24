import { ClientModel } from "../../models/client";
import { controller } from "./handler";
import mongoose from "mongoose";

describe("load-fixtures handler", () => {
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  test("should load fixtures", async () => {
    await expect(ClientModel.countDocuments()).resolves.toBe(0);
    const result = await controller();
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    await expect(ClientModel.countDocuments()).resolves.toBe(3);
  });
});
