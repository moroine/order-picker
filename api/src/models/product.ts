export type ProductType = "KeyNetic" | "KeyVibe";

export type Product = {
  name: "KeyNetic" | "KeyVibe";
  id: `${ProductType}_V${number}_${string}`;
  version: number;
};
