import React from "react";
import { Route, Routes } from "react-router-dom";
import { useCartId } from "../hooks/useCartId";
import { Cart } from "./Cart";
import { OrderSummary } from "./OrderSummary";
import { Shop } from "./Shop";

interface AppProps {

}

export const App: React.FC<AppProps> = ({

}) => {
  const { cartId, resetCartId } = useCartId();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Shop cartId={cartId!} />
        }
      />
      <Route
        path="/cart"
        element={
          <Cart cartId={cartId!} onCheckout={resetCartId}/>
        }
      />
      <Route
        path="/order-summary/:orderId"
        element={<OrderSummary  />}
      />
    </Routes>
  );
};
