import {NestFactory} from "@nestjs/core";
import {OrderModule} from "./order.module";
import {OrderRepository} from "../adapters/order.repo";

export async function createOrdersApp(orderRepo: OrderRepository) {
    const app = await NestFactory.create(OrderModule.register(orderRepo))
    app.enableCors({origin: "*"});
    await app.init();
    return app;
}