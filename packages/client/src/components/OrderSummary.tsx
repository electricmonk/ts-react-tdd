import React, {useEffect, useState} from "react";
import {OrderAdapter} from "../adapters/order";
import {useNavigate, useParams} from "react-router-dom";
import {Order} from "@ts-react-tdd/server/src/types";


interface OrderSummaryProps {
    orderAdapter: OrderAdapter
}


export const OrderSummary: React.FC<OrderSummaryProps> = ({orderAdapter}) => {
    const navigate = useNavigate();

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
        <button aria-label="Home" role="button" onClick={() => navigate("/")}>Home</button>

    </section>
}