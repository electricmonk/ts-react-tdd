import React, { PropsWithChildren, useMemo } from "react";
import axios, {AxiosInstance} from "axios";

type Adapters = {
  cart: AxiosInstance;
  productCatalog: AxiosInstance;
  orders: AxiosInstance;
}

export const IOContext = React.createContext<Adapters>(undefined as unknown as Adapters);

export const MonolithIOProvider: React.FC<PropsWithChildren<{backendUrl: string}>> = ({backendUrl, children}) => {
  const client = useMemo(() => axios.create({ baseURL: backendUrl }), [backendUrl])

  return <IOContext.Provider value={{cart: client, productCatalog: client, orders: client}}>{children}</IOContext.Provider>;
}

type Props = PropsWithChildren<{catalogUrl: string, cartUrl: string, ordersUrl: string}>;
export const MicroservicesIOProvider: React.FC<Props> = ({catalogUrl, cartUrl, ordersUrl, children}) => {
  const cart = useMemo(() => axios.create({ baseURL: cartUrl }), [cartUrl])
  const productCatalog = useMemo(() => axios.create({ baseURL: catalogUrl }), [catalogUrl])
  const orders = useMemo(() => axios.create({ baseURL: ordersUrl }), [ordersUrl])

  return <IOContext.Provider value={{cart, productCatalog, orders}}>{children}</IOContext.Provider>;
}