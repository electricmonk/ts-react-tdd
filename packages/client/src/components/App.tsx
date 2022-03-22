import React, {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import {Shop} from "./Shop";
import Cookies from "js-cookie";
import {CartAdapter} from "../adapters/cart";
import {Cart} from "./Cart";
import {ProductCatalog} from "../adapters/productCatalog";
import {OrderSummary} from "./OrderSummary";
import {OrderAdapter} from "../adapters/order";

interface AppProps {
    cartAdapter: CartAdapter,
    catalog: ProductCatalog,
    orderAdapter: OrderAdapter
};

export const App: React.FC<AppProps> = ({cartAdapter, catalog, orderAdapter}) => {

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
        <Route path="/" element={<Shop cartAdapter={cartAdapter} cartId={cartId!}
                                       productCatalog={catalog}/>}/>
        <Route path="/cart" element={<Cart cartAdapter={cartAdapter} cartId={cartId!}/>}/>
        <Route path="/order-summary/:orderId" element={<OrderSummary orderAdapter={orderAdapter}/>}/>
    </Routes>
}

