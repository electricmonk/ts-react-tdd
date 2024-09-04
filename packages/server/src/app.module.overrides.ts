import { Module} from "@nestjs/common";
import {CartController} from "./cart/cartController";
import {MongoDBModule} from "./adapters/mongodb.module";
import {KafkaCartManager} from "./cart/kafkaCartManager";
import {ProductController} from "./catalog/productController";
import {OrderController} from "./orders/orderController";

@Module({
    imports: [MongoDBModule.default()],
    providers: [KafkaCartManager],
    controllers: [CartController, ProductController, OrderController]
})
export class AppModuleOverrides {

}