import { HydratedDocument } from "mongoose";
import { IOrder, OrderModel } from "../models/order";

type ListOrdersItem = {
  _id: string;
  clientName: string;
  status: IOrder["status"];
};

export async function listOrders(): Promise<ListOrdersItem[]> {
  return OrderModel.aggregate<ListOrdersItem>([
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "clients",
      },
    },
    {
      $unwind: "$clients",
    },
    {
      $project: {
        clientName: "$clients.name",
        status: 1,
      },
    },
  ]).exec();
}
