import {DynamicModule, Module} from "@nestjs/common";
import {CartController, CheckoutController, OrderController, ProductController} from "./controllers";
import {OrderRepository} from "./adapters/order.repo";
import {ProductRepository} from "./adapters/product.repo";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./adapters";
import {MemoryCartRepository} from "./adapters/cart.repo";

@Module({})
export class AppModule {
    static register(productRepo: ProductRepository, orderRepo: OrderRepository): DynamicModule {
        return {
            module: AppModule,
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
                }
            ],
            controllers: [CartController, ProductController, OrderController, CheckoutController]

        }
    }
}