import React from "react";
import {Route, Routes} from "react-router-dom";
import {Shop} from "./Shop";
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

    return <Routes>
        <Route path="/" element={<Shop cartAdapter={cartAdapter} productCatalog={catalog}/>}/>
        <Route path="/cart" element={<Cart cartAdapter={cartAdapter}/>}/>
        <Route path="/order-summary/:orderId" element={<OrderSummary orderAdapter={orderAdapter}/>}/>
    </Routes>
}

