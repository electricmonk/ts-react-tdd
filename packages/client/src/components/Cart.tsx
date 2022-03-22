import {CartAdapter} from "../adapters/cart";
import React from "react";
import {useNavigate} from "react-router-dom";

interface CartProps {
    cartAdapter: CartAdapter;
    cartId: string;

}

export const Cart: React.FC<CartProps> = ({cartId, cartAdapter}) => {
    const navigate = useNavigate();

    const checkout = async () => {
         const orderId = await cartAdapter.checkout(cartId)
        navigate("/order-summary/" + orderId)
    }

    return <section>
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>
}