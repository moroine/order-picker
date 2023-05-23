import { Schema, model, Types } from "mongoose";

export interface IOrder {
  // Map<productId, quantity>
  card: Map<string, number>;
  status: "pending" | "processing" | "done";
  client: Types.ObjectId;
}

export const orderSchema = new Schema<IOrder>({
  card: { type: Map, of: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "done"],
    required: true,
  },
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
});

export const OrderModel = model<IOrder>("Order", orderSchema);
