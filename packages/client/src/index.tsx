import ReactDom from "react-dom";
import {App} from "./components/App";
import {BrowserRouter} from "react-router-dom";
import {HTTPShopBackend} from "./adapters/HTTPShopBackend";

const config = {
    apiUrl: process.env.API_URL!,
};

const backend = new HTTPShopBackend(config.apiUrl);

const root = document.querySelector("#root");
ReactDom.render(<BrowserRouter><App cartAdapter={backend} catalog={backend} orderAdapter={backend} /></BrowserRouter>, root);
