import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { IOContext } from "../adapters/context";


interface OrderSummaryProps {
}


export const OrderSummary: React.FC<OrderSummaryProps> = () => {
    const { orders } = useContext(IOContext);
    const navigate = useNavigate();

    const {orderId} = useParams<{ orderId: string }>();
    const {data: order, isLoading, error} = useQuery("order", () => orders.getOrder(orderId!), {enabled: !!orderId});

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
            {order?.items.map(({productId, name}) => <li key={productId}>{name}</li>)}
        </ul>
        <button aria-label="Home" role="button" onClick={() => navigate("/")}>Home</button>

    </section>
}