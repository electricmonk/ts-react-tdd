import {Product} from "@ts-react-tdd/server/types";

export interface CartAdapter {
    getCount: (cartId: string) => Promise<number>;
    addItem: (cartId: string, productId: Product["id"]) => Promise<void>;
    checkout: (cartId: string) => Promise<string>;
}

