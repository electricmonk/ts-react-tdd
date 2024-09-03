import {Body, Controller, Get, Inject, Param, Post, Query, UsePipes} from '@nestjs/common';
import {ProductRepository} from './adapters/product.repo';
import {ProductTemplate} from "./types";
import {OrderRepository} from "./adapters/order.repo";
import {CartRepository} from "./adapters/cart.repo";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./adapters";
import {ZodValidationPipe} from "./zodValidationPipe";
import {CartManager} from "./cartManager";

@Controller("/products")
export class ProductController {
    constructor(@Inject(PRODUCT_REPO) private productRepo: ProductRepository) {}

    @Post()
    @UsePipes(new ZodValidationPipe(ProductTemplate))
    async createProduct(@Body() product: ProductTemplate) {
        return this.productRepo.create(product);
    }

    @Get()
    async getProducts() {
        return this.productRepo.findAll();
    }

    @Get("/search")
    async searchProducts(@Query("query") query: string) {
        return this.productRepo.findByTitle(query);
    }
}

@Controller("/order")
export class OrderController {
    constructor(@Inject(ORDER_REPO) private orderRepo: OrderRepository) {}

    @Get("/:orderId")
    async getOrder(@Param("orderId") orderId: string) {
        return this.orderRepo.findById(orderId);
    }
}

@Controller("/cart")
export class CartController {
    constructor(@Inject(CartManager) private cartManager: CartManager, @Inject(CART_REPO) private cartRepo: CartRepository) {}

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
}

@Controller("/checkout")
export class CheckoutController {
    constructor(@Inject(CartManager) private cartManager: CartManager) {}

    @Post("/:cartId")
    async checkout(@Param("cartId") cartId: string) {
        const order = await this.cartManager.checkout(cartId);
        return order.id
    }

}