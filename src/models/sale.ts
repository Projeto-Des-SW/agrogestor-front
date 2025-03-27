import { Member } from "./member";
import { mapToSaleItem, SaleItem } from "./saleItem";

export interface Sale {
  id: number;
  date: Date;
  member: Member;
  saleItems: SaleItem[];
}

export function mapToSale(sale: Sale): Sale {
  return Object.fromEntries(
    Object.entries(sale).map(([key, value]) => {
      if (key === "date") return [key, new Date(value)];
      if (key === "saleItems") return [key, value.map(mapToSaleItem)];
      return [key, value];
    }),
  ) as Sale;
}
