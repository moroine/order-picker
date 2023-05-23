import { Schema, model } from "mongoose";

export type ProductType = "KeyNetic" | "KeyVibe";

export interface IProduct {
  name: "KeyNetic" | "KeyVibe";
  version: number;
  ref: `${ProductType}_V${number}`;
}

export const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, enum: ["KeyNetic", "KeyVibe"] },
  version: { type: Number },
  ref: { type: String, required: true },
});

export const ProductModel = model<IProduct>("Product", productSchema);
