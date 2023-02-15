import React from "react";
import {useNavigate} from "react-router-dom";
import {useCartSummary} from "../hooks/cart";

interface CartProps {
    id: string;
    onCheckout: () => any,

}

export const Cart: React.FC<CartProps> = ({id, onCheckout}) => {
    const navigate = useNavigate();

    const { isLoading, error, summary, checkout } = useCartSummary(id);

    const checkoutAndViewOrder = async () => {
        const orderId = await checkout();
        await onCheckout();
        navigate("/order-summary/" + orderId)
    }

    if (isLoading) {
        return <section>Loading...</section>
    }

    if (error) {
        return <section><>Error: {error}</></section>
    }

    return <section>
        <ul>
            {summary?.items.map(({productId, name}) => <li key={productId}>{name}</li>)}
        </ul>
        <button aria-label="Checkout" role="button" onClick={checkoutAndViewOrder}>Checkout</button>
    </section>
};
