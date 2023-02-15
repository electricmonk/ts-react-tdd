import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { IOContext } from "../adapters/context";

interface CartProps {
    id: string;
    onCheckout: () => any,

}

export const Cart: React.FC<CartProps> = ({id, onCheckout}) => {
    const navigate = useNavigate();
    const { cart } = useContext(IOContext);
    const {data: summary, isLoading, error} = useQuery({
        queryKey: 'cartSummary',
        queryFn: () => cart.getCartSummary(id)
    })

    const checkout = async () => {
        const orderId = await cart.checkout(id)
        await onCheckout(); // it's ok to await on an non-async function
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
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>;
};
