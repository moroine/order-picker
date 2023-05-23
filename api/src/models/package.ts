import type { Order } from "./order";
import type { Product } from "./product";

export type Package = {
  id: string;
  order: Order["id"];
  status: "pending" | "sent" | "received";
  content: {
    [id: Product["id"]]: number;
  };
};
