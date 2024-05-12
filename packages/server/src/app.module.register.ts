import {DynamicModule, Module} from "@nestjs/common";
import {CartController, CheckoutController, OrderController, ProductController} from "./controllers";


@Module({})
export class AppModuleWithRegister {
    static register(adapters: DynamicModule) {
        return {
            imports: [adapters],
            controllers: [CartController, ProductController, OrderController, CheckoutController],
            module: AppModuleWithRegister
        }
    }
}