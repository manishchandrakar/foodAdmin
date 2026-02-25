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


//Product Types

// GST / Tax
export interface GstRate {
  id: number;
  name: string;              // e.g. "GST 5%"
  percentage: number;        // 5, 12, 18 etc
}

// Unit (kg, piece, litre etc)
export interface Unit {
  id: number;
  name: string;              // Kilogram
  symbol: string;            // kg
}

// Category
export interface Category {
  id: number;
  name: string;
  slug?: string;
}

// Review User (minimal version for reviews)
export interface ReviewUser {
  id: number;
  name: string;
  avatar?: string;
}

// Review
export interface ProductReview {
  id: number;
  rating: number;            // 1–5
  comment: string;
  createdAt: string;
  user?: ReviewUser;
}

// Main Product Interface
export interface Product {
  id: number;
  name: string;
  slug?: string;

  description?: string;
  image?: string;

  price: number;
  mrp?: number;

  stock: number;
  status: "active" | "inactive";

  categoryId: number;
  category?: Category;

  unit?: Unit;
  gstRate?: GstRate;

  avgRating?: number;
  totalReviews?: number;

  createdAt?: string;
  updatedAt?: string;
}