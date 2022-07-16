import React from "react"
import { CartAdapter } from "./cart";
import { OrderAdapter } from "./order";
import { ProductCatalog } from "./productCatalog";

type Adapters = {
  cart: CartAdapter;
  productCatalog: ProductCatalog;
  orders: OrderAdapter;
}

export const IOContext = React.createContext<Adapters>(undefined as unknown as Adapters);