import {DynamicModule, Module} from "@nestjs/common";
import {CartController} from "./cart/cartController";
import {CartManager} from "./cart/cartManager";
import {ProductController} from "./catalog/productController";
import {OrderController} from "./orders/orderController";


@Module({
})
export class AppModuleWithRegister {
    static register(adapters: DynamicModule): DynamicModule {
        return {
            imports: [adapters],
            providers: [CartManager],
            controllers: [CartController, ProductController, OrderController],
            module: AppModuleWithRegister
        }
    }
}