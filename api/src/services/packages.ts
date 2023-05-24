import { ObjectId } from "mongodb";
import { IOrder, OrderModel } from "src/models/order";

export async function createPackage(
  orderId: string
): Promise<IOrder["packages"]> {
  const order = await OrderModel.findOneAndUpdate(
    { _id: orderId, status: { $ne: "done" } },
    {
      $set: {
        status: "processing",
      },
      $push: {
        packages: {
          _id: new ObjectId(),
          items: [],
          status: "pending",
        },
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  return order.packages;
}
