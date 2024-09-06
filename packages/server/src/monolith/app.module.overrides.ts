import { Module} from "@nestjs/common";
import {MongoDBModule} from "../adapters/mongodb.module";
import {MonolithicCartManager} from "./monolithic-cart-manager";
import {CartController, OrderController, ProductController} from "./controllers";

@Module({
    imports: [MongoDBModule.default()],
    providers: [MonolithicCartManager],
    controllers: [CartController, ProductController, OrderController]
})
export class AppModuleOverrides {

}