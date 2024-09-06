import {ProductRepository} from "../adapters/product.repo";
import {NestFactory} from "@nestjs/core";
import {CatalogModule} from "./catalog.module";
import {MicroserviceOptions} from "@nestjs/microservices";

export async function createCatalogApp(productRepo: ProductRepository, microserviceOptions: MicroserviceOptions) {
    const app = await NestFactory.create(CatalogModule.register(productRepo))
    app.enableCors({origin: "*"});
    app.connectMicroservice(microserviceOptions);
    await app.init();
    await app.startAllMicroservices();
    return app;
}