import { Schema, model } from "mongoose";

export interface IStaff {
  name: string;
  role: "logistician";
}

export const staffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  role: { type: String, enum: ["logistician"], required: true },
});

export const StaffModel = model<IStaff>("Staff", staffSchema);
