import { Schema, model, Types } from "mongoose";
import { ProductType } from "./product";

export interface IItem {
  uid: `${ProductType}_V${number}_${string}`;
  client: Types.ObjectId | null;
  order: Types.ObjectId | null;
}

export const itemSchema = new Schema<IItem>({
  uid: { type: String, required: true, unique: true },
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: false,
    default: null,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: false,
    default: null,
    index: true,
  },
});

export const ItemModel = model<IItem>("Item", itemSchema);
