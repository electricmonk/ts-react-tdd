import {Cart, Product} from "../types";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MemoryCartRepository {
    carts: Cart[] = [];

    async addToCart(cartId: string, product: Product) {
        const cart = this.carts.find(({id}) => id === cartId) || {id: cartId, items: []};
        cart.items.push({productId: product.id, price: product.price, name: product.title});
        this.carts = this.carts.filter(({id}) => id !== cartId).concat(cart);
    }
    async findById(cartId: string): Promise<Cart | null> {
        return this.carts.find(({id}) => id === cartId) || null;
    }
}

export type CartRepository = Omit<MemoryCartRepository, "carts">;