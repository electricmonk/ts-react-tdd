import {DynamicModule, Module} from "@nestjs/common";
import {OrderRepository} from "../adapters/order.repo";
import {ProductRepository} from "../adapters/product.repo";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "../adapters";
import {MemoryCartRepository} from "../adapters/cart.repo";
import {MonolithicCartManager} from "./monolithic-cart-manager";
import {CartController, OrderController, ProductController} from "./controllers";

@Module({})
export class AppModuleInversionOfControl {
    static register(productRepo: ProductRepository, orderRepo: OrderRepository): DynamicModule {
        return {
            module: AppModuleInversionOfControl,
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
                MonolithicCartManager
            ],
            controllers: [CartController, ProductController, OrderController]

        }
    }
}