import React from "react";
import { Route, Routes } from "react-router-dom";
import { useCartId } from "../hooks/cart";
import { Cart } from "./Cart";
import { OrderSummary } from "./OrderSummary";
import { Shop } from "./Shop";

export const App: React.FC<{}> = ({
}) => {
  const { cartId, resetCartId } = useCartId();
  return (
    <Routes>
      <Route path="/" element={<Shop cartId={cartId!}/>}/>
      <Route path="/cart" element={<Cart id={cartId!} onCheckout={resetCartId}/>}/>
      <Route path="/order-summary/:orderId" element={<OrderSummary/>}/>
    </Routes>
  );
};
