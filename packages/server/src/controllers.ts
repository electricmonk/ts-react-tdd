import {
    ArgumentMetadata,
    BadRequestException,
    Body,
    Controller,
    Get, Inject,
    Param,
    PipeTransform,
    Post,
    UsePipes
} from '@nestjs/common';
import { ZodSchema} from 'zod';
import { ProductRepository } from './adapters/product.repo';
import {ProductTemplate} from "./types";
import {OrderRepository} from "./adapters/order.repo";
import {CartRepository} from "./adapters/cart.repo";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./adapters";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch (error) {
            throw new BadRequestException(`failed parsing value ${value} into type ${metadata.type} with ${error}`);
        }
    }
}

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
    constructor(@Inject(PRODUCT_REPO) private productRepo: ProductRepository, @Inject(CART_REPO) private cartRepo: CartRepository) {}

    @Post("/:cartId")
    async addToCart(@Param("cartId") cartId: string, @Body() {productId}: {productId: string}) {
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new BadRequestException(`product with id ${productId} not found`);
        }
        await this.cartRepo.addToCart(cartId, product);
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
    constructor(@Inject(CART_REPO) private cartRepo: CartRepository, @Inject(ORDER_REPO) private orderRepo: OrderRepository) {}

    @Post("/:cartId")
    async checkout(@Param("cartId") cartId: string) {
        const cart = await this.cartRepo.findById(cartId);
        if (!cart) {
            throw new BadRequestException(`no cart with id ${cartId} found`);
        }
        const order = await this.orderRepo.create({items: cart.items});
        return order.id
    }

}