import { OrderAdapter} from "./order";
import { ProductCatalog} from "./productCatalog";
import {CartAdapter} from "./cart";
import {Order, Product } from "@ts-react-tdd/server/types";

interface Cart {
    id: string;
    products: Product["id"][]
}

export class InMemoryShopBackend implements CartAdapter, OrderAdapter, ProductCatalog {
    #sessions: Record<string, Cart> = {};
    private orders: Order[] = [];

    constructor(private products: Product[]) {

    }

    async findAllProducts(): Promise<Product[]> {
        return this.products;
    }

    async addItem(cartId: string, productId: Product["id"]) {
        this.#sessions[cartId] = this.#sessions[cartId] || {id: cartId, products: []};
        this.#sessions[cartId].products.push(productId);
    }

    async getCount(cartId: string) {
        return this.#sessions[cartId]?.products.length ?? 0;
    }

    async checkout(cartId: string) {
        const cart = this.#sessions[cartId];
        this.orders.push({
            id: cartId,
            products: cart.products.map(id => this.products.find(product => id === product.id)!)
        })
        return cartId
    }

    async getOrder(orderId: string) {
        return this.orders.find(({id}) => id === orderId) || null;
    }

    async createProduct(product: Product) {
        this.products.push(product);
    }

}