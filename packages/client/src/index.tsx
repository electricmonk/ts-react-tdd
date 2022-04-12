import ReactDom from "react-dom";
import { App } from "./components/App";
import { BrowserRouter } from "react-router-dom";
import { HTTPShopBackend } from "./adapters/HTTPShopBackend";
import { ChakraProvider } from "@chakra-ui/react";

const config = {
  apiUrl: process.env.API_URL!,
};

const backend = new HTTPShopBackend(config.apiUrl);

const root = document.querySelector("#root");
ReactDom.render(
  <BrowserRouter>
    <ChakraProvider>
      <App cartAdapter={backend} catalog={backend} orderAdapter={backend} />
    </ChakraProvider>
  </BrowserRouter>,
  root
);
