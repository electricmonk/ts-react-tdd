import {CartAdapter} from "../adapters/cart";
import React from "react";

interface CartProps {
    cartAdapter: CartAdapter;
    cartId: string;
    navigate: (to: string) => void;

}

export const Cart: React.FC<CartProps> = ({cartId, cartAdapter, navigate}) => {

    const checkout = () => {
        navigate("/order-summary")
    }

    return <section>
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>
}