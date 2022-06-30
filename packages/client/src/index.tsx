import ReactDom from "react-dom";
import {App} from "./components/App";
import {BrowserRouter} from "react-router-dom";
import {HTTPShopBackend} from "./adapters/HTTPShopBackend";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { RecoilRoot } from "recoil";

const config = {
    apiUrl: process.env.API_URL!,
};

const backend = new HTTPShopBackend(config.apiUrl);
const queryClient = new QueryClient();
const root = document.querySelector("#root");

ReactDom.render(
    <RecoilRoot>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App cartAdapter={backend} catalog={backend} orderAdapter={backend} />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </RecoilRoot>, root
);
