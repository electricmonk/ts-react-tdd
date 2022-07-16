import {CartSummary, Product} from "@ts-react-tdd/server/src/types";

export interface CartAdapter {
    getCount: (cartId: string) => Promise<number>;
    addItem: (cartId: string, productId: Product["id"]) => Promise<void>;
    checkout: (cartId: string) => Promise<string>;
    getCartSummary: (cartId: string) => Promise<CartSummary>;
}

