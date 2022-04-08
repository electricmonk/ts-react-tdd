import {Order} from "@ts-react-tdd/server/src/types";

export interface OrderAdapter {
    getOrder: (orderId: string) => Promise<Order | null>
}

