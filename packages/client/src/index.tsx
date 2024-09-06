/// <reference types="vite/client" />

import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from "react-router-dom";
import {MicroservicesIOProvider, MonolithIOProvider} from './adapters/context';
import { App } from "./components/App";

import {CART_PORT, CATALOG_PORT, ORDERS_PORT} from "@ts-react-tdd/server/src/ports";

interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

// @ts-ignore
interface ImportMeta {
    readonly env: ImportMetaEnv
}

const config = {
    apiUrl: import.meta.env.VITE_API_URL,
};

const queryClient = new QueryClient();
const rootContainer = document.querySelector("#root");
const root = createRoot(rootContainer!);

// @ts-ignore
const monolith = <MonolithIOProvider backendUrl={config.apiUrl}><QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</QueryClientProvider></MonolithIOProvider>;

const microservices = <MicroservicesIOProvider cartUrl={`http://localhost:${CART_PORT}`}
    ordersUrl={`http://localhost:${ORDERS_PORT}`}
    catalogUrl={`http://localhost:${CATALOG_PORT}`}><QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</QueryClientProvider></MicroservicesIOProvider>

root.render(microservices);
