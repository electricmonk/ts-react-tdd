import { Module} from "@nestjs/common";
import {CartController, CheckoutController, OrderController, ProductController} from "./controllers";
import {MongoDBModule} from "./adapters/mongodb.module";

@Module({
    imports: [MongoDBModule.forRoot(`mongodb://root:password@127.0.0.1`)],
    controllers: [CartController, ProductController, OrderController, CheckoutController]
})
export class AppModuleOverrides {

}