import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useOrder} from "../hooks/order";

export const OrderSummary: React.FC<{}> = () => {
    const navigate = useNavigate();
    const {orderId} = useParams<{ orderId: string }>();
    const { order, isLoading, error } = useOrder(orderId!);

    if (isLoading) {
        return <section>Loading...</section>
    }

    if (error) {
        return <section><>Error: {error}</></section>
    }

    return <section>
        <h2>Thank You</h2>
        <span> {order?.id}</span>
        <ul>
            {order?.items.map(({productId, name}) => <li key={productId} aria-label={name}>{name}</li>)}
        </ul>
        <button aria-label="Home" role="button" onClick={() => navigate("/")}>Home</button>

    </section>
}