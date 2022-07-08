import { anEmptyCart, CartSummary, LineItem, Order, Product } from "@ts-react-tdd/server/src/types";
import { nanoid } from "nanoid";
import { CartAdapter } from "./cart";
import { OrderAdapter } from "./order";
import { ProductCatalog } from "./productCatalog";

type Cart = {
    id: string;
    items: LineItem[]
}

type ProductTemplate = Omit<Product,"id">
export class InMemoryShopBackend implements CartAdapter, OrderAdapter, ProductCatalog {
    #sessions: Record<string, Cart> = {};
    private orders: Order[] = [];
    private products: Product[] = [];

    constructor(products: ProductTemplate[]) {
        products.forEach(p => this.createProduct(p));
    }

    async findAllProducts(): Promise<Product[]> {
        return this.products;
    }

    async addItem(cartId: string, productId: Product["id"]) {
        this.#sessions[cartId] = this.#sessions[cartId] || anEmptyCart(cartId);
        this.#sessions[cartId].items.push(this.productToLineItem(productId));
    }

    async getCount(cartId: string) {
        return this.#sessions[cartId]?.items.length ?? 0;
    }

    async getCartSummary(cartId: string): Promise<CartSummary>{
        return this.#sessions[cartId]
    }


    async checkout(cartId: string) {
        const cart = this.#sessions[cartId];
        this.orders.push({
            id: cartId,
            items: cart.items
        })
        return cartId
    }

    async getOrder(orderId: string) {
        return this.orders.find(({id}) => id === orderId) || null;
    }

    async createProduct(productFields: Omit<Product, "id">) {
        const product = {...productFields, id: nanoid()};
        this.products.push(product);
        return product;
    }

    productToLineItem(id: Product["id"]): LineItem {
        const product = this.products.find(p => id === p.id)!
        return {
            productId: product.id,
            name: product.title,
            price: product.price
        }
    }
}

export function inMemoryBackend(products: ProductTemplate[] = []) {
    const backend = new InMemoryShopBackend(products);
    return {
      cart: backend,
      productCatalog: backend,
      orders: backend,
    }
  }