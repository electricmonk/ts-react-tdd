import { CartSummary, Order, Product } from "@ts-react-tdd/server/src/types";
import { AxiosInstance } from "axios";
import { CartAdapter } from "./cart";
import { OrderAdapter } from "./order";
import { ProductCatalog } from "./productCatalog";

export class HTTPShopBackend implements CartAdapter, OrderAdapter, ProductCatalog {
    constructor(private cart: AxiosInstance, private catalog: AxiosInstance, private orders: AxiosInstance) {
    }

    addItem = async (cartId: string, productId: string) =>
        (await this.cart.post<void>(`/cart/${cartId}`, { productId })).data;

    getCount = async (cartId: string) =>
        (await this.cart.get<number>(`/cart/${cartId}/count`)).data;

    getCartSummary = async (cartId: string) => {
        const res = await this.cart.get<CartSummary>(`/cart/${cartId}`);
        return CartSummary.parse(res.data);
    }

    checkout = async (cartId: string) => (await this.cart.post<string>(`/cart/${cartId}/checkout`)).data;

    getOrder = async (orderId: string) => {
        const res = await this.orders.get<Order>(`/order/${orderId}`);
        return Order.parse(res.data);
    };

    findAllProducts = async () => {
        const res = await this.catalog.get<unknown[]>(`/products`);
        return res.data.map(p => Product.parse(p));
    };

    async searchProducts(freeTextSearch: string): Promise<Product[]> {
        const res = await this.catalog.get<unknown[]>(`/products/search?query=${freeTextSearch}`);
        return res.data.map(p => Product.parse(p));
    }

}
