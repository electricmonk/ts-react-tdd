import { Module} from "@nestjs/common";
import {CartController, CheckoutController, OrderController, ProductController} from "./controllers";
import {MongoDBModule} from "./adapters/mongodb.module";

@Module({
    imports: [MongoDBModule.default()],
    controllers: [CartController, ProductController, OrderController, CheckoutController]
})
export class AppModuleOverrides {

}