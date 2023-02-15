import React, { PropsWithChildren, useMemo } from "react";
import { HTTPShopBackend } from './backend';
import { CartAdapter } from "./cart";
import { OrderAdapter } from "./order";
import { ProductCatalog } from "./productCatalog";

type Adapters = {
  cart: CartAdapter;
  productCatalog: ProductCatalog;
  orders: OrderAdapter;
}

export const IOContext = React.createContext<Adapters>(undefined as unknown as Adapters);

export const IOContextProvider: React.FC<PropsWithChildren<{backendUrl: string}>> = ({backendUrl, children}) => {
  const backend = useMemo(() => new HTTPShopBackend(backendUrl), [backendUrl]);
  return <IOContext.Provider value={{cart: backend, productCatalog: backend, orders: backend}}>{children}</IOContext.Provider>;
}