import {ProductRepository} from "../adapters/product.repo";
import {NestFactory} from "@nestjs/core";
import {OrderRepository} from "../adapters/order.repo";
import {CartModule} from "./cart.module";

export async function createCartApp(productRepo: ProductRepository, orderRepo: OrderRepository) {
    const app = await NestFactory.create(CartModule.register(productRepo, orderRepo));
    app.enableCors({origin: "*"});
    await app.init();
    return app;
}