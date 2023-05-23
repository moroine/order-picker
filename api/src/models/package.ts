import { Schema, model, Types } from "mongoose";

export interface IPackage {
  items: Types.ObjectId[];
  status: "pending" | "sent" | "received";
  order: Types.ObjectId;
}

export const packageSchema = new Schema<IPackage>({
  items: [{ type: Schema.Types.ObjectId, ref: "Item", required: true }],
  status: {
    type: String,
    enum: ["pending", "sent", "received"],
    required: true,
  },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
});

export const PackageModel = model<IPackage>("Package", packageSchema);
