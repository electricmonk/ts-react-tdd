import {CartRepository} from "../adapters/cart.repo";
import {BadRequestException, Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {CART_REPO} from "../adapters";
import {ClientKafka} from "@nestjs/microservices";
import {Order, Product} from "../types";
import {firstValueFrom} from "rxjs";

export const CART_CLIENT = 'cartClient';

@Injectable()
export class KafkaCartManager implements OnModuleInit{
    constructor(@Inject(CART_CLIENT) private client: ClientKafka,
                @Inject(CART_REPO) private cartRepo: CartRepository) {
    }

    async addToCart(cartId: string, productId: string) {
        const product = await firstValueFrom(this.client.send<Product>('productById', productId));
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
        return firstValueFrom(this.client.send<Order>('createOrder', {items: cart.items}));
    }

    async onModuleInit() {
        this.client.subscribeToResponseOf('productById');
        this.client.subscribeToResponseOf('createOrder');
        await this.client.connect();
    }
}