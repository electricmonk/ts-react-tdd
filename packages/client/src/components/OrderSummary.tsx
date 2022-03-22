import React, {useEffect, useState} from "react";
import {Order, OrderAdapter} from "../adapters/order";
import {useParams} from "react-router-dom";


interface OrderSummaryProps {
    orderAdapter: OrderAdapter
}


export const OrderSummary: React.FC<OrderSummaryProps> = ({orderAdapter}) => {
    const [order, setOrder] = useState<Order | null>(null)
    const {orderId} = useParams<{ orderId: string }>();

    useEffect(() => {
        if (orderId) {
            (async () => {
                const order = await orderAdapter.getOrder(orderId);
                setOrder(order)
            })();
        }
    }, [orderId])
    return <section>
        <h2>Thank You</h2>
        <span> {order?.id}</span>
        <ul>
            {order?.products.map(({id, title}) => <li key={id}>{title}</li>)}
        </ul>
    </section>
}