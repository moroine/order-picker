import mongoose, { HydratedDocument } from "mongoose";
import { init } from "../models";
import { ClientModel, IClient } from "../models/client";
// import { IItem, ItemModel } from "../models/item";
import { IOrder, OrderModel } from "../models/order";
import { IProduct, ProductModel } from "../models/product";
import { IStaff, StaffModel } from "../models/staff";

type StaffFixture = {
  isaac: HydratedDocument<IStaff>;
  ismael: HydratedDocument<IStaff>;
};

async function createStaff(): Promise<StaffFixture> {
  const isaac = new StaffModel({
    name: "Isaac",
    role: "logistician",
  });

  const ismael = new StaffModel({
    name: "Ismaël",
    role: "logistician",
  });

  await Promise.all([isaac.save(), ismael.save()]);

  return { isaac, ismael };
}

type ClientFixture = {
  clientA: HydratedDocument<IClient>;
  clientB: HydratedDocument<IClient>;
  clientC: HydratedDocument<IClient>;
  idToClient: {
    [id: string]: HydratedDocument<IClient>;
  };
};

async function createClients(): Promise<ClientFixture> {
  const clientA = new ClientModel({ name: "Client A" });
  const clientB = new ClientModel({ name: "Client B" });
  const clientC = new ClientModel({ name: "Client C" });

  await Promise.all([clientA.save(), clientB.save(), clientC.save()]);

  return {
    clientA,
    clientB,
    clientC,
    idToClient: {
      [clientA._id.toString()]: clientA,
      [clientB._id.toString()]: clientB,
      [clientC._id.toString()]: clientC,
    },
  };
}

type ProductFixture = {
  KeyNeticV1: HydratedDocument<IProduct>;
  KeyNeticV2: HydratedDocument<IProduct>;
  KeyVibeV1: HydratedDocument<IProduct>;
};

async function createProducts(): Promise<ProductFixture> {
  const KeyNeticV1 = new ProductModel({
    name: "KeyNetic",
    version: 1,
    ref: "KeyNetic_V1",
  });
  const KeyNeticV2 = new ProductModel({
    name: "KeyNetic",
    version: 2,
    ref: "KeyNetic_V2",
  });
  const KeyVibeV1 = new ProductModel({
    name: "KeyVibe",
    version: 1,
    ref: "KeyVibe_V1",
  });

  await Promise.all([KeyNeticV1.save(), KeyNeticV2.save(), KeyVibeV1.save()]);

  return {
    KeyNeticV1,
    KeyNeticV2,
    KeyVibeV1,
  };
}

type OrdersFixture = {
  ordersClientA: HydratedDocument<IOrder>[];
  all: HydratedDocument<IOrder>[];
};

async function createOrders(clients, products): Promise<OrdersFixture> {
  const orderClientA1 = new OrderModel({
    card: new Map([[products.KeyNeticV1.ref, 1]]),
    status: "pending",
    client: clients.clientA._id,
  });

  await orderClientA1.save();

  const ordersClientA = [orderClientA1];

  return {
    ordersClientA,
    all: [...ordersClientA],
  };
}

// async function createItems(
//   product: IProduct,
//   count: number,
// ) {
//   const items: IItem[] = [];
//   const tasks: unknown[] = [];
//   for (let i = 0; i < count; i++) {
//     const ref = String(i).padStart(5, '0');
//     const item = new ItemModel({
//       uid: `${product.name}_V${product.version}_${ref}`,
//     });
//     items.push(item)
//     tasks.push(item.save())
//   }

//   await Promise.all(tasks);
//   return items;
// }

export type MainFixture = {
  clients: ClientFixture;
  products: ProductFixture;
  staff: StaffFixture;
  orders: OrdersFixture;
};

export async function initMainFixture(): Promise<MainFixture> {
  await init();
  await Promise.all([
    ClientModel.deleteMany({}),
    ProductModel.deleteMany({}),
    StaffModel.deleteMany({}),
    OrderModel.deleteMany({}),
  ]);

  const [clients, products, staff] = await Promise.all([
    createClients(),
    createProducts(),
    createStaff(),
  ]);

  const [orders] = await Promise.all([createOrders(clients, products)]);

  return {
    clients,
    products,
    staff,
    orders,
  };
}
