export interface ProductionLog {
    id: number;
    date: string;
    shift: "Manhã" | "Tarde" | "Noite";
    quantity: number;
    member: {
      id: number;
      name: string;
    };
  }
  