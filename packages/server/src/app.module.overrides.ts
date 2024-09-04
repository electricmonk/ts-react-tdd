import { Module} from "@nestjs/common";
import {CartController} from "./cart/cartController";
import {MongoDBModule} from "./adapters/mongodb.module";
import {CartManager} from "./cart/cartManager";
import {ProductController} from "./catalog/productController";
import {OrderController} from "./orders/orderController";

@Module({
    imports: [MongoDBModule.default()],
    providers: [CartManager],
    controllers: [CartController, ProductController, OrderController]
})
export class AppModuleOverrides {

}