import { CartAdapter } from "../adapters/cart";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CartProps {
  cartAdapter: CartAdapter;
  cartId: string;
  onCheckout: () => Promise<void> | void;
}

export const Cart: React.FC<CartProps> = ({
  cartId,
  onCheckout,
  cartAdapter,
}) => {
  const navigate = useNavigate();
  const checkout = async () => {
    const orderId = await cartAdapter.checkout(cartId);
    // awaiting non-async functions does nothing so it's safe.
    await onCheckout();
    navigate("/order-summary/" + orderId);
  };

  return (
    <section>
      <button aria-label="Checkout" role="button" onClick={checkout}>
        Checkout
      </button>
    </section>
  );
};
