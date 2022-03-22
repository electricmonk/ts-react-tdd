import ReactDom from "react-dom";
import {App} from "./components/App";
import {BrowserRouter} from "react-router-dom";
import {HTTPCartAdapter} from "./adapters/cart";

const config = {
    apiUrl: process.env.API_URL!,
};

const cartAdapter = new HTTPCartAdapter(config.apiUrl);

const root = document.querySelector("#root");
ReactDom.render(<BrowserRouter><App cartAdapter={cartAdapter} catalog={{}} emailSender={{}}/></BrowserRouter>, root);
