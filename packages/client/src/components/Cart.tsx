import {CartAdapter} from "../adapters/cart";
import React from "react";
import {useNavigate} from "react-router-dom";
import { useRecoilValue } from "recoil";
import { CartId } from "../state";

interface CartProps {
    cartAdapter: CartAdapter;
}

export const Cart: React.FC<CartProps> = ({cartAdapter}) => {
    const navigate = useNavigate();
    const cartId = useRecoilValue(CartId);

    const checkout = async () => {
         const orderId = await cartAdapter.checkout(cartId)
        navigate("/order-summary/" + orderId)
    }

    return <section>
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>
}