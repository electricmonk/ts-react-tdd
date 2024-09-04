import React, { PropsWithChildren, useMemo } from "react";
import { HTTPShopBackend } from './backend';
import { CartAdapter } from "./cart";
import { OrderAdapter } from "./order";
import { ProductCatalog } from "./productCatalog";
import axios from "axios";

type Adapters = {
  cart: CartAdapter;
  productCatalog: ProductCatalog;
  orders: OrderAdapter;
}

export const IOContext = React.createContext<Adapters>(undefined as unknown as Adapters);

export const MonolithIOProvider: React.FC<PropsWithChildren<{backendUrl: string}>> = ({backendUrl, children}) => {
  const client = axios.create({ baseURL: backendUrl })

  const backend = useMemo(() => new HTTPShopBackend(client, client, client), [backendUrl]);
  return <IOContext.Provider value={{cart: backend, productCatalog: backend, orders: backend}}>{children}</IOContext.Provider>;
}

type Props = PropsWithChildren<{catalogUrl: string, cartUrl: string, ordersUrl: string}>;
export const MicroservicesIOProvider: React.FC<Props> = ({catalogUrl, cartUrl, ordersUrl, children}) => {
  const cart = axios.create({ baseURL: cartUrl })
  const catalog = axios.create({ baseURL: catalogUrl })
  const orders = axios.create({ baseURL: ordersUrl })

  const backend = useMemo(() => new HTTPShopBackend(cart, catalog, orders), [cartUrl, catalogUrl, ordersUrl]);
  return <IOContext.Provider value={{cart: backend, productCatalog: backend, orders: backend}}>{children}</IOContext.Provider>;
}