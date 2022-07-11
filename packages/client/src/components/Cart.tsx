import { CartSummary } from "@ts-react-tdd/server/src/types";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOContext } from "../adapters/context";

interface CartProps {
    id: string;

}

export const Cart: React.FC<CartProps> = ({id}) => {
    const navigate = useNavigate();
    const { cart } = useContext(IOContext);
    const [ summary, setSummary ] = useState<CartSummary | undefined>();

    useEffect(() => {
        cart.getCartSummary(id).then(setSummary);
    }, [id]);

    const checkout = async () => {
        const orderId = await cart.checkout(id)
        navigate("/order-summary/" + orderId)
    }

    return <section>
        <ul>
            {summary?.items.map(({productId, name}) => <li key={productId}>{name}</li>)}
        </ul>
        <button aria-label="Checkout" role="button" onClick={checkout}>Checkout</button>
    </section>
}