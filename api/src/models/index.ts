import mongoose from "mongoose";
import { ClientModel } from "./client";
import { OrderModel } from "./order";
import { ProductModel } from "./product";
import { StaffModel } from "./staff";

export const init = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  await Promise.all([
    ClientModel.init(),
    OrderModel.init(),
    ProductModel.init(),
    StaffModel.init(),
  ]);
};
