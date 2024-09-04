import {OrderRepository} from "../adapters/order.repo";
import {DynamicModule} from "@nestjs/common";
import {CART_REPO, ORDER_REPO} from "../adapters";
import {MemoryCartRepository} from "../adapters/cart.repo";
import {CartManager} from "./cartManager";
import {CartController} from "./cartController";

export class CartModule {
    static register(clientsModule: DynamicModule, orderRepo: OrderRepository): DynamicModule {
        return {
            module: CartModule,
            imports: [clientsModule],
            providers: [
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