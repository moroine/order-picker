import { Schema, model } from "mongoose";

export interface IClient {
  id: string;
  name: string;
}

export const clientSchema = new Schema<IClient>({
  name: { type: String, required: true },
});

export const ClientModel = model<IClient>("Client", clientSchema);
