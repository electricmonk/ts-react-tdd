import {Body, Controller, Get, Inject, Param, Post} from '@nestjs/common';
import {CartRepository} from "../adapters/cart.repo";
import {CART_REPO} from "../adapters";
import {KafkaCartManager} from "./kafkaCartManager";

@Controller("/cart")
export class CartController {
    constructor(@Inject(KafkaCartManager) private cartManager: KafkaCartManager, @Inject(CART_REPO) private cartRepo: CartRepository) {}

    @Post("/:cartId")
    async addToCart(@Param("cartId") cartId: string, @Body() {productId}: {productId: string}) {
        await this.cartManager.addToCart(cartId, productId);
    }

    @Get("/:cartId/count")
    async getCartCount(@Param("cartId") cartId: string) {
        const cart = await this.cartRepo.findById(cartId);
        return cart?.items.length || 0;
    }

    @Get("/:cartId")
    async getCart(@Param("cartId") cartId: string) {
        return this.cartRepo.findById(cartId);
    }

    @Post("/:cartId/checkout")
    async checkout(@Param("cartId") cartId: string) {
        const order = await this.cartManager.checkout(cartId);
        return order.id
    }
}

