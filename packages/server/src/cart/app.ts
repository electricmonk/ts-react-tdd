import {NestFactory} from "@nestjs/core";
import {CartModule} from "./cart.module";
import {DynamicModule} from "@nestjs/common";

export async function createCartApp(clientsModule: DynamicModule) {
    const app = await NestFactory.create(CartModule.register(clientsModule));
    app.enableCors({origin: "*"});
    await app.init();
    return app;
}