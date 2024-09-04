import {NestFactory} from "@nestjs/core";
import {OrderRepository} from "../adapters/order.repo";
import {CartModule} from "./cart.module";
import {DynamicModule} from "@nestjs/common";

export async function createCartApp(clientsModule: DynamicModule, orderRepo: OrderRepository) {
    const app = await NestFactory.create(CartModule.register(clientsModule, orderRepo));
    app.enableCors({origin: "*"});
    await app.init();
    return app;
}