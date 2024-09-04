import {ProductRepository} from "../adapters/product.repo";
import {NestFactory} from "@nestjs/core";
import {CatalogModule} from "./catalog.module";

export async function createCatalogApp(productRepo: ProductRepository) {
    const app = await NestFactory.create(CatalogModule.register(productRepo))
    app.enableCors({origin: "*"});
    await app.init();
    return app;
}