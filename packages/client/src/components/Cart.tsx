import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IOContext } from "../adapters/context";

interface CartProps {
  cartId: string;
  onCheckout: () => Promise<void> | void;
}

export const Cart: React.FC<CartProps> = ({
  cartId,
  onCheckout,
}) => {
  const navigate = useNavigate();
  const { cart } = useContext(IOContext);

  const checkout = async () => {
    const orderId = await cart.checkout(cartId);
    await onCheckout();  // awaiting non-async functions does nothing so it's safe.
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
