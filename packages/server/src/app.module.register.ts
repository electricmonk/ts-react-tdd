import {DynamicModule, Module} from "@nestjs/common";
import {CartController, CheckoutController, OrderController, ProductController} from "./controllers";
import {CartManager} from "./cartManager";


@Module({
})
export class AppModuleWithRegister {
    static register(adapters: DynamicModule): DynamicModule {
        return {
            imports: [adapters],
            providers: [CartManager],
            controllers: [CartController, ProductController, OrderController, CheckoutController],
            module: AppModuleWithRegister
        }
    }
}