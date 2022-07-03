import { createRoot } from 'react-dom/client';
import {App} from "./components/App";
import {BrowserRouter} from "react-router-dom";
import {HTTPShopBackend} from "./adapters/HTTPShopBackend";
import { QueryClient, QueryClientProvider } from "react-query";

const config = {
    apiUrl: process.env.API_URL!,
};

const backend = new HTTPShopBackend(config.apiUrl);
const queryClient = new QueryClient();
const rootContainer = document.querySelector("#root");
const root = createRoot(rootContainer!);

root.render(<QueryClientProvider client={queryClient}>
    <BrowserRouter>
        <App cartAdapter={backend} catalog={backend} orderAdapter={backend} />
    </BrowserRouter>
</QueryClientProvider>);
