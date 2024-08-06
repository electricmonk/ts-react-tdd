import {CartRepository} from "./adapters/cart.repo";
import {BadRequestException, Inject, Injectable} from "@nestjs/common";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./adapters";
import {ProductRepository} from "./adapters/product.repo";
import {OrderRepository} from "./adapters/order.repo";

@Injectable()
export class CartManager {
    constructor(@Inject(PRODUCT_REPO) private productRepo: ProductRepository,
                @Inject(ORDER_REPO) private orderRepo: OrderRepository,
                @Inject(CART_REPO) private cartRepo: CartRepository) {
    }

    async addToCart(cartId: string, productId: string) {
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error(`product with id ${productId} not found`);
        }
        await this.cartRepo.addToCart(cartId, product);
    }

    async checkout(cartId: string) {
        const cart = await this.cartRepo.findById(cartId);
        if (!cart) {
            throw new BadRequestException(`no cart with id ${cartId} found`);
        }
        return this.orderRepo.create({items: cart.items});
    }
}