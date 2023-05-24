import { ClientModel } from "../models/client";
import { IOrder, IPackage, OrderModel } from "../models/order";
import { IProduct, ProductModel } from "../models/product";

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

type OrderDetails = {
  _id: string;
  clientName: string;
  status: IOrder["status"];
  card: Array<{
    product: IProduct;
    qty: number;
  }>;
  packages: Array<{
    _id: string;
    items: string[];
    status: IPackage["status"];
  }>;
};

export async function getOrder(id: string): Promise<OrderDetails | null> {
  const order = await OrderModel.findOne({ _id: id });

  if (!order) {
    return null;
  }

  const [client, products] = await Promise.all([
    ClientModel.findById(order.client.toString()),
    ProductModel.find({ ref: { $in: Array.from(order.card.keys()) } }),
  ]);

  if (!client) {
    throw new Error("Client not found");
  }

  const productById = new Map();
  for (const product of products) {
    productById.set(product.id, product);
  }

  const details = {
    _id: order._id.toString(),
    clientName: client.name,
    status: order.status,
    card: products.map((product) => {
      const qty = order.card.get(product.ref) ?? 0;
      return {
        product: {
          _id: product._id,
          name: product.name,
          ref: product.ref,
          version: product.version,
        },
        qty,
      };
    }),
    packages: order.packages.map((p) => ({
      _id: p._id.toString(),
      items: p.items.map((i) => i.toString()),
      status: p.status,
    })),
  };

  return details;
}
