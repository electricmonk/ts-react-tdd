import { CartSummary, Order, Product } from "@ts-react-tdd/server/src/types";
import axios, { AxiosInstance } from "axios";
import { CartAdapter } from "./cart";
import { OrderAdapter } from "./order";
import { ProductCatalog } from "./productCatalog";

export class HTTPShopBackend implements CartAdapter, OrderAdapter, ProductCatalog {
    private axios: AxiosInstance;
    constructor(url: string) {
        this.axios = axios.create({ baseURL: url })
    }

    addItem = async (cartId: string, productId: string) =>
        (await this.axios.post<void>(`/cart/${cartId}`, { productId })).data;

    getCount = async (cartId: string) =>
        (await this.axios.get<number>(`/cart/${cartId}/count`)).data;

    getCartSummary = async (cartId: string) => (await this.axios.get<CartSummary>(`/cart/${cartId}`)).data;

    checkout = async (cartId: string) => (await this.axios.post<string>(`/checkout/${cartId}`)).data;

    getOrder = async (orderId: string) =>
        (await this.axios.get<Order>(`/order/${orderId}`)).data;

    findAllProducts = async () =>
        (await this.axios.get<Product[]>(`/products`)).data;

}

export function httpBackend(url: string) {
    const backend = new HTTPShopBackend(url);
    return {
        cart: backend,
        productCatalog: backend,
        orders: backend,
    }
}