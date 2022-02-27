import ReactDom from "react-dom";
import { HTTPCartAdapter } from "./adapters/cart";
import { Shop } from "./components/Shop";

const config = {
  apiUrl: process.env.API_URL!,
};

const cartAdapter = new HTTPCartAdapter(config.apiUrl);
const root = document.querySelector("#root");
ReactDom.render(
  <Shop cartAdapter={cartAdapter} cartId={new Date().toString()} />,
  root
);
