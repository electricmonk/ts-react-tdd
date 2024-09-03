import { Module} from "@nestjs/common";
import {CartController, CheckoutController, OrderController, ProductController} from "./controllers";
import {MongoDBModule} from "./adapters/mongodb.module";
import {CartManager} from "./cartManager";

@Module({
    imports: [MongoDBModule.default()],
    providers: [CartManager],
    controllers: [CartController, ProductController, OrderController, CheckoutController]
})
export class AppModuleOverrides {

}