import axios from "axios";
import {Product} from "./productCatalog";

export interface CartAdapter {
    getCount: (cartId: string) => Promise<number>;
    addItem: (cartId: string, productId: Product["id"]) => Promise<void>;
    checkout: (cartId: string) => Promise<string>;
}

export class HTTPCartAdapter implements CartAdapter {
    constructor(private url: string) {
    }

    addItem = async (cartId: string) =>
        (await axios.post<void>(`${this.url}/cart/${cartId}`)).data;
    getCount = async (cartId: string) =>
        (await axios.get<number>(`${this.url}/cart/${cartId}`)).data;

    checkout = (cartId: string) => {
        throw new Error("not implemented")
    }
}
