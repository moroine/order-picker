import { HydratedDocument } from "mongoose";
import { IOrder, OrderModel } from "../models/order";

export async function listOrders(): Promise<HydratedDocument<IOrder>[]> {
  return OrderModel.find();
}
