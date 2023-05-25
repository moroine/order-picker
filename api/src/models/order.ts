import { Schema, model, Types } from "mongoose";
import { IItem } from "./item";

export interface IPackage {
  _id: Types.ObjectId;
  items: IItem["uid"][];
  status: "pending" | "sent" | "received";
}

export interface IOrder {
  // Map<productRef, quantity>
  card: Map<string, number>;
  status: "pending" | "processing" | "done";
  client: Types.ObjectId;
  packages: IPackage[];
}

type OrderModelProps = {
  packages: Types.DocumentArray<IPackage>;
};

export const orderSchema = new Schema<IOrder, object, OrderModelProps>({
  card: { type: Map, of: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "done"],
    required: true,
  },
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  packages: [
    {
      items: [{ type: String, ref: "Item", required: true }],
      status: {
        type: String,
        enum: ["pending", "sent", "received"],
        required: true,
      },
    },
  ],
});
orderSchema.set("toJSON", { flattenObjectIds: true });

export const OrderModel = model<IOrder>("Order", orderSchema);
