import { Schema, model } from "mongoose";

export type ProductType = "KeyNetic" | "KeyVibe";

export interface IProduct {
  _id: `${ProductType}_V${number}_${string}`;
  name: "KeyNetic" | "KeyVibe";
  version: number;
}

export const productSchema = new Schema<IProduct>({
  _id: { type: String, required: true },
  name: { type: String, required: true, enum: ["KeyNetic", "KeyVibe"] },
  version: { type: Number },
});

export const ProductModel = model<IProduct>("Product", productSchema);
