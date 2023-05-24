import { HydratedDocument } from "mongoose";
import { init } from "../models";
import { ClientModel, IClient } from "../models/client";
import { IOrder, OrderModel } from "../models/order";
import { IProduct, ProductModel } from "../models/product";
import { IStaff, StaffModel } from "../models/staff";
import { IItem, ItemModel } from "../models/item";

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

async function createItemsForProduct(
  product: IProduct,
  count: number
): Promise<HydratedDocument<IItem>[]> {
  const items: HydratedDocument<IItem>[] = [];
  for (let i = 0; i < count; i++) {
    const ref = String(i).padStart(5, "0");
    const item = new ItemModel({
      uid: `${product.name}_V${product.version}_${ref}`,
      client: null,
      order: null,
    });
    items.push(item);
  }

  await Promise.all(items.map((i) => i.save()));
  return items;
}

type ItemFixture = {
  keyNeticV1Items: HydratedDocument<IItem>[];
  keyNeticV2Items: HydratedDocument<IItem>[];
  keyVibeV1Items: HydratedDocument<IItem>[];
};

async function createItems(products: ProductFixture): Promise<ItemFixture> {
  const [keyNeticV1Items, keyNeticV2Items, keyVibeV1Items] = await Promise.all([
    createItemsForProduct(products.KeyNeticV1, 5),
    createItemsForProduct(products.KeyNeticV2, 100),
    createItemsForProduct(products.KeyVibeV1, 80),
  ]);

  return {
    keyNeticV1Items,
    keyNeticV2Items,
    keyVibeV1Items,
  };
}

type OrdersFixture = {
  pendingOrders: HydratedDocument<IOrder>[];
  doneOrders: HydratedDocument<IOrder>[];
  processingOrders: HydratedDocument<IOrder>[];
  all: HydratedDocument<IOrder>[];
};

async function createOrders(
  clients: ClientFixture,
  products: ProductFixture,
  items: ItemFixture
): Promise<OrdersFixture> {
  const availableItems: ItemFixture = {
    keyNeticV1Items: [...items.keyNeticV1Items],
    keyNeticV2Items: [...items.keyNeticV2Items],
    keyVibeV1Items: [...items.keyVibeV1Items],
  };

  const doneOrderClientB1Items = availableItems.keyVibeV1Items.splice(0, 4);
  const doneOrderClientB1 = new OrderModel({
    card: new Map([
      // All but one
      [products.KeyNeticV1.ref, 4],
    ]),
    status: "done",
    client: clients.clientB._id,
    packages: [
      {
        status: "received",
        items: doneOrderClientB1Items.map((i) => i.uid),
      },
    ],
  });

  const processingOrderClientA1Items = [
    ...availableItems.keyNeticV1Items.splice(0, 1),
    ...availableItems.keyVibeV1Items.splice(0, 4),
  ];
  const processingOrderClientA1 = new OrderModel({
    card: new Map([
      [products.KeyNeticV1.ref, 1],
      [products.KeyNeticV2.ref, 3],
      [products.KeyVibeV1.ref, 12],
    ]),
    status: "processing",
    client: clients.clientA._id,
    packages: [
      {
        status: "received",
        items: processingOrderClientA1Items.map((i) => i.uid),
      },
    ],
  });

  const pendingOrderClientA1 = new OrderModel({
    card: new Map([
      [products.KeyNeticV1.ref, 1],
      [products.KeyNeticV2.ref, 5],
    ]),
    status: "pending",
    client: clients.clientA._id,
    packages: [],
  });

  // Following order matter for tests, we need to introduce timestamp
  await doneOrderClientB1.save();
  await processingOrderClientA1.save();
  await pendingOrderClientA1.save();

  await Promise.all([
    processingOrderClientA1Items.map((i) => {
      i.client = clients.clientA._id;
      i.order = processingOrderClientA1._id;
      return i.save();
    }),
    doneOrderClientB1Items.map((i) => {
      i.client = clients.clientB._id;
      i.order = doneOrderClientB1._id;
      return i.save();
    }),
  ]);

  const pendingOrders = [pendingOrderClientA1];
  const doneOrders = [doneOrderClientB1];
  const processingOrders = [processingOrderClientA1];

  return {
    pendingOrders,
    doneOrders,
    processingOrders,
    all: [...doneOrders, ...processingOrders, ...pendingOrders],
  };
}

export type MainFixture = {
  clients: ClientFixture;
  products: ProductFixture;
  staff: StaffFixture;
  orders: OrdersFixture;
  items: ItemFixture;
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

  const items = await createItems(products);

  const [orders] = await Promise.all([createOrders(clients, products, items)]);

  return {
    clients,
    products,
    staff,
    orders,
    items,
  };
}
