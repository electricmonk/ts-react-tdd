import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";
import {Order} from "@ts-react-tdd/server/src/types";

export const useOrder = (orderId: string) => {
    const {orders} = useContext(IOContext);
    const {data, isLoading, error} = useQuery("order", async () => {
        const res = await orders.get<Order>(`/order/${orderId}`);
        return Order.parse(res.data);
    }, {enabled: !!orderId});

    return {
        order: data,
        isLoading,
        error
    }
}