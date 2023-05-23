import { Schema, model } from "mongoose";
import { ProductType } from "./product";

export interface IItem {
  uid: `${ProductType}_V${number}_${string}`;
}

export const itemSchema = new Schema<IItem>({
  uid: { type: String, required: true },
});

export const ItemModel = model<IItem>("Item", itemSchema);
