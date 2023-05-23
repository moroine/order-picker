import { Schema, model, Types } from "mongoose";

export interface IPackage {
  // Map<productId, quantity>
  content: Map<string, number>;
  status: "pending" | "sent" | "received";
  order: Types.ObjectId;
}

export const packageSchema = new Schema<IPackage>({
  content: { type: Map, of: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "sent", "received"],
    required: true,
  },
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
});

export const PackageModel = model<IPackage>("Package", packageSchema);
