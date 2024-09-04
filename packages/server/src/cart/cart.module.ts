import {ProductRepository} from "../adapters/product.repo";
import {OrderRepository} from "../adapters/order.repo";
import {DynamicModule} from "@nestjs/common";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "../adapters";
import {MemoryCartRepository} from "../adapters/cart.repo";
import {CartManager} from "./cartManager";
import {CartController} from "./cartController";

export class CartModule {
    static register(productRepo: ProductRepository, orderRepo: OrderRepository): DynamicModule {
        return {
            module: CartModule,
            providers: [
                {
                    provide: PRODUCT_REPO,
                    useValue: productRepo
                },
                {
                    provide: ORDER_REPO,
                    useValue: orderRepo,
                },
                {
                    provide: CART_REPO,
                    useClass: MemoryCartRepository,
                },
                CartManager,
            ],
            controllers: [CartController]

        }
    }
}