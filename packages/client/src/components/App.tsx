import React from "react";
import {Route, Routes} from "react-router-dom";
import {Shop} from "./Shop";
import Cookies from "js-cookie";
import {HTTPCartAdapter} from "../adapters/cart";
import {Cart} from "./Cart";

let cartId = Cookies.get("cartId");
if (!cartId) {
    cartId = new Date().getTime().toString();
    Cookies.set("cartId", cartId);
}

const config = {
    apiUrl: process.env.API_URL!,
};

const cartAdapter = new HTTPCartAdapter(config.apiUrl);
export const App: React.FC = () => {
    return <Routes>
        <Route path="/" element={<Shop cartAdapter={cartAdapter} cartId={cartId!} />} />
        <Route path="/cart" element={<Cart cartAdapter={cartAdapter} cartId={cartId!} />} />
        <Route path="/order-summary" element={<section><h2 aria-label="Thank You">Thank you</h2></section>} />
    </Routes>
}

