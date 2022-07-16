import { faker } from "@faker-js/faker";

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

export const aProduct = (overrides: Partial<Product> = {}) => ({ title: faker.name.findName(), price: Math.round(Math.random() * 1000), ...overrides });

export const anEmptyCart = (id: string) =>  ({id, items: []});
