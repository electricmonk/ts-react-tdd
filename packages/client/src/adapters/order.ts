import {Order} from "@ts-react-tdd/server/types";

export interface OrderAdapter {
    getOrder: (orderId: string) => Promise<Order | null>
}

