import {Product} from "./productCatalog";

export interface OrderAdapter {
    getOrder: (orderId: string) => Promise<Order | null>
}

export interface Order {
    id: string;
    products: Product[];
}

