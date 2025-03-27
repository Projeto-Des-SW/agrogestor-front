import { mapToProductPrice, ProductPrice } from "./productPrice";

export interface SaleItem {
  id: number;
  quantity: number;
  productPriceId: number;
  saleOrderId: number;
  productPrice: ProductPrice;
}

export function mapToSaleItem(saleItem: SaleItem): SaleItem {
  return Object.fromEntries(
    Object.entries(saleItem).map(([key, value]) => {
      if (key === "productPrice") return [key, mapToProductPrice(value)];
      return [key, value];
    }),
  ) as SaleItem;
}
