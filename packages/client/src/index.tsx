import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { IOContext } from './adapters/context';
import { httpBackend } from "./adapters/HTTPShopBackend";
import { App } from "./components/App";

const config = {
    apiUrl: process.env.API_URL!,
};

const rootContainer = document.querySelector("#root");
const root = createRoot(rootContainer!);

root.render(<BrowserRouter><IOContext.Provider value={httpBackend(config.apiUrl)}><App /></IOContext.Provider></BrowserRouter>);
