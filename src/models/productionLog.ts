import { mapToProductionEntry, ProductionEntry } from "./productionEntry";

export interface ProductionLog {
  id: number;
  date: Date;
  member: {
    id: number;
    name: string;
    disabled: boolean;
    groupId: number;
  };
  productionEntries: ProductionEntry[];
}

export function mapToProductionLog(
  productionLog: ProductionLog,
): ProductionLog {
  return Object.fromEntries(
    Object.entries(productionLog).map(([key, value]) => {
      if (key === "date") return [key, new Date(value)];
      if (key === "productionEntries")
        return [key, value.map(mapToProductionEntry)];
      return [key, value];
    }),
  ) as ProductionLog;
}
