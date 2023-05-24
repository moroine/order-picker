import { ItemModel } from "src/models/item";
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

export type AddItemToOrderInput = {
  packageId: string;
  itemUid: string;
};

export type AddItemToOrderSuccess = {
  success: true;
  packages: IOrder["packages"];
};

export type AddItemToOrderFailure = {
  success: false;
  error: string;
};

export type AddItemToOrderResult =
  | AddItemToOrderSuccess
  | AddItemToOrderFailure;

export async function addItemToOrder(
  orderId: string,
  input: AddItemToOrderInput
): Promise<AddItemToOrderSuccess | AddItemToOrderFailure> {
  const order = await OrderModel.findById(orderId);

  if (!order) {
    return { success: false, error: "Order not found" };
  }

  if (order.status === "done") {
    return { success: false, error: "Cannot add item to done order" };
  }

  const packagedItems = order.packages.flatMap((p) => p.items);

  const productRef = input.itemUid.split("_", 2).join("_");
  const productPackagedCount = packagedItems.filter((i) =>
    i.startsWith(productRef)
  ).length;

  const expectedCount = order.card.get(productRef) ?? 0;

  if (productPackagedCount + 1 >= expectedCount) {
    return { success: false, error: "Item should not be added" };
  }

  let found = false;
  for (const pkg of order.packages) {
    if (pkg._id.toString() === input.packageId) {
      found = true;
      pkg.items.push(input.itemUid as any);
    }
  }

  if (!found) {
    return { success: false, error: "Package not found" };
  }

  const updatedItem = await ItemModel.findOneAndUpdate(
    { uid: input.itemUid, client: null, order: null },
    {
      $set: {
        client: order.client,
        order: order._id,
      },
    }
  );

  if (!updatedItem) {
    return { success: false, error: "Item is not available" };
  }

  await order.save();

  return { success: true, packages: order.packages };
}
