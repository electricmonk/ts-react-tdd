import {NestFactory} from "@nestjs/core";
import {OrderModule} from "./order.module";
import {OrderRepository} from "../adapters/order.repo";
import {MicroserviceOptions} from "@nestjs/microservices";

export async function createOrdersApp(orderRepo: OrderRepository, microserviceOptions: MicroserviceOptions) {
    const app = await NestFactory.create(OrderModule.register(orderRepo))
    app.enableCors({origin: "*"});
    app.connectMicroservice(microserviceOptions);
    await app.init();
    await app.startAllMicroservices();
    return app;
}