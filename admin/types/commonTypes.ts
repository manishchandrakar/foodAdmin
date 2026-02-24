export type LogLevel = "debug" | "info" | "warn" | "error";

// ─── Shared Form Value Interfaces ─────────────────────────────────────────

export interface IUnitFormValues {
  name: string;
  symbol: string;
}

export interface IGstRateFormValues {
  name: string;
  percentage: number;
}


// ─── Types ───
export interface ICartLineItem {
  productId: string;
  quantity: number;
  price: number;
}

export  interface CreateFormState {
  userId: string;
  items: ICartLineItem[];
}