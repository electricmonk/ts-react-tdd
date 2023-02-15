import {useContext} from "react";
import {IOContext} from "../adapters/context";
import {useQuery} from "react-query";

export const useOrder = (orderId: string) => {
    const {orders} = useContext(IOContext);
    const {data, isLoading, error} = useQuery("order", () => orders.getOrder(orderId), {enabled: !!orderId});

    return {
        order: data,
        isLoading,
        error
    }
}