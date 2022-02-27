import ReactDom from "react-dom";
import { HTTPCartAdapter } from "./adapters/cart";
import { Shop } from "./components/Shop";
import Cookies from 'js-cookie';

let cartId = Cookies.get('cartId');
if (!cartId) {
  cartId = new Date().getTime().toString();
  Cookies.set("cartId", cartId);
}

const config = {
  apiUrl: process.env.API_URL!,
};

const cartAdapter = new HTTPCartAdapter(config.apiUrl);
const root = document.querySelector("#root");
ReactDom.render(
  <Shop cartAdapter={cartAdapter} cartId={cartId} />,
  root
);
