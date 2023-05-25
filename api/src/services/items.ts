import { ItemModel } from "../models/item";

export async function getAvailableItems(): Promise<string[]> {
  const items = await ItemModel.find({ order: null });

  return items.map((i) => i.uid);
}
