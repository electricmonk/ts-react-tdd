import { z } from 'zod';

export const ProductTemplate = z.object({
  title: z.string(),
  price: z.number(), // in a real-life scenario this would be a BigInt

});
export const Product = ProductTemplate.and(z.object({
  id: z.string(),
}));

export type ProductTemplate = z.infer<typeof ProductTemplate>;
export type Product = z.infer<typeof Product>;


export const LineItem = z.object({
  name: z.string(),
  price: z.number(),
  productId: z.string(),
});

export type LineItem = z.infer<typeof LineItem>;

export const CartSummary = z.object({
  id: z.string(),
  items: z.array(LineItem),
});

export type CartSummary = z.infer<typeof CartSummary>;

export const Order = z.object({
  id: z.string(),
  items: z.array(LineItem),
});

export type Order = z.infer<typeof Order>;