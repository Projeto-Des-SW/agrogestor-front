export interface ProductionEntry {
  id: number;
  date: Date;
  quantity: number;
  productionLogId: number;
  price: number;
  period: ProductionLogPeriod;
}

export enum ProductionLogPeriod {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
}

export function mapToProductionEntry(
  productionEntry: ProductionEntry,
): ProductionEntry {
  return Object.fromEntries(
    Object.entries(productionEntry).map(([key, value]) => {
      if (key === "date") return [key, new Date(value)];
      return [key, value];
    }),
  ) as ProductionEntry;
}
