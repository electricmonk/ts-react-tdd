/// <reference types="vite/client" />

import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from "react-router-dom";
import { IOContextProvider } from './adapters/context';
import { App } from "./components/App";

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

root.render(<IOContextProvider backendUrl={config.apiUrl}><QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</QueryClientProvider></IOContextProvider>);
