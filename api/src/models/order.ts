import type { Product } from "./product";
import type { Client } from "./client";

export type Order = {
  id: string;
  card: {
    [id: Product["id"]]: number;
  };
  status: "pending" | "processing" | "done";
  client: Client["id"];
};
