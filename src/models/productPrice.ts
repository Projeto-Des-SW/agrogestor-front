import Big from "big.js";
import { Product } from "./product";

export interface ProductPrice {
  id: number;
  groupId: number;
  date: Date;
  price: Big;
  productId: number;
  product: Product;
}

export function mapToProductPrice(productPrice: ProductPrice): ProductPrice {
  return Object.fromEntries(
    Object.entries(productPrice).map(([key, value]) => {
      if (key === "date") return [key, new Date(value)];
      if (key === "price") return [key, new Big(value)];
      return [key, value];
    }),
  ) as ProductPrice;
}
