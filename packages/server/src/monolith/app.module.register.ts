import {DynamicModule, Module} from "@nestjs/common";
import {MonolithicCartManager} from "./monolithic-cart-manager";
import {CartController, OrderController, ProductController} from "./controllers";


@Module({
})
export class AppModuleWithRegister {
    static register(adapters: DynamicModule): DynamicModule {
        return {
            imports: [adapters],
            providers: [MonolithicCartManager],
            controllers: [CartController, ProductController, OrderController],
            module: AppModuleWithRegister
        }
    }
}