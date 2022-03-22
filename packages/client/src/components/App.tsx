import React from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Shop} from "./Shop";
import Cookies from "js-cookie";
import {CartAdapter, HTTPCartAdapter} from "../adapters/cart";

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

interface CartProps {
    cartAdapter: CartAdapter;
    cartId: string;
}

const Cart: React.FC<CartProps> = ({cartId, cartAdapter}) => {

    const navigate = useNavigate();

    const checkout = () => {
        navigate("/order-summary")
    }

    return <section>
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>
}