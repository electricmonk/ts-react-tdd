import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Cart } from "./Cart";
import { OrderSummary } from "./OrderSummary";
import { Shop } from "./Shop";

interface AppProps { 

};

export const App: React.FC<AppProps> = () => {

    const [cartId, setCartId] = useState<string | null>(null);
    useEffect(() => {
        setCartId(new Date().getTime().toString());
    }, []);

    useEffect(() => {
        if (cartId) {
            Cookies.set("cartId", cartId);
        }
    }, [cartId]);

    return <Routes>
        <Route path="/" element={<Shop cartId={cartId!}/>}/>
        <Route path="/cart" element={<Cart id={cartId!}/>}/>
        <Route path="/order-summary/:orderId" element={<OrderSummary/>}/>
    </Routes>
}

