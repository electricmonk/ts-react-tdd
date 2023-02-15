import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from "react-router-dom";
import { IOContextProvider } from './adapters/context';
import { App } from "./components/App";

const config = {
    apiUrl: process.env.API_URL!,
};

const queryClient = new QueryClient();
const rootContainer = document.querySelector("#root");
const root = createRoot(rootContainer!);

root.render(<IOContextProvider backendUrl={config.apiUrl}><QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</QueryClientProvider></IOContextProvider>);
