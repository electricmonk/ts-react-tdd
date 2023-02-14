export type LineItem = {
  name: string;
  price: number;
  productId?: string;
}

export type CartSummary = {
  id: string;
  items: LineItem[];
}

export type Order = {
  id: string;
  items: LineItem[];
}

export type Product = {
  id: string;
  title: string;
  price: number; // in a real-life scenario this would be a BigInt
}
export type ProductTemplate = Omit<Product,"id">

