import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Order} from "@ts-react-tdd/server/src/types";
import { IOContext } from "../adapters/context";


interface OrderSummaryProps {
}


export const OrderSummary: React.FC<OrderSummaryProps> = () => {
    const { orders } = useContext(IOContext);
    const [order, setOrder] = useState<Order | null>(null)
    const {orderId} = useParams<{ orderId: string }>();

    useEffect(() => {
        if (orderId) {
            (async () => {
                const order = await orders.getOrder(orderId);
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