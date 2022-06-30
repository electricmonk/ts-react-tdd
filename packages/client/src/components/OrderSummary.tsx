import React from "react";
import {OrderAdapter} from "../adapters/order";
import {useParams} from "react-router-dom";
import { useQuery } from "react-query";


interface OrderSummaryProps {
    orderAdapter: OrderAdapter
}


export const OrderSummary: React.FC<OrderSummaryProps> = ({orderAdapter}) => {
    const {orderId} = useParams<{ orderId: string }>();
    const {data: order, isLoading, error} = useQuery("order", () => orderAdapter.getOrder(orderId!), {enabled: !!orderId});

    if (isLoading) {
        return <section>Loading...</section>
    }

    if (error) {
        return <section>Error: {error}</section>
    }

    return <section>
        <h2>Thank You</h2>
        <span> {order?.id}</span>
        <ul>
            {order?.products.map(({id, title}) => <li key={id}>{title}</li>)}
        </ul>
    </section>
}