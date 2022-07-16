import axios from "axios";
import {CartAdapter} from "./cart";
import {ProductCatalog} from "./productCatalog";
import {CartSummary, Order, Product} from "@ts-react-tdd/server/src/types";
import {OrderAdapter} from "./order";

export class HTTPShopBackend implements CartAdapter, OrderAdapter, ProductCatalog {
    constructor(private url: string) {
    }

    addItem = async (cartId: string, productId: string) =>
        (await axios.post<void>(`${this.url}/cart/${cartId}`, {productId})).data;

    getCount = async (cartId: string) =>
        (await axios.get<number>(`${this.url}/cart/${cartId}/count`)).data;

    getCartSummary = async (cartId: string) => (await axios.get<CartSummary>(`${this.url}/cart/${cartId}`)).data;

    checkout = async (cartId: string) => (await axios.post<string>(`${this.url}/checkout/${cartId}`)).data;

    getOrder = async (orderId: string) =>
        (await axios.get<Order>(`${this.url}/order/${orderId}`)).data;

    findAllProducts = async () =>
        (await axios.get<Product[]>(`${this.url}/products`)).data;

}

export function httpBackend(url: string) {
    const backend = new HTTPShopBackend(url);
    return {
      cart: backend,
      productCatalog: backend,
      orders: backend,
    }
  }