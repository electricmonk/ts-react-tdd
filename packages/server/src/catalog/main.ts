import {MongoClient} from "mongodb";
import {MongoDBProductRepository} from "../adapters/product.repo";
import {createCatalogApp} from "./app";
import {Transport} from "@nestjs/microservices";
import {MongoConfig} from "../adapters/mongodb.module";
import {CATALOG_PORT} from "../ports";

export async function startCatalogServer({uri, dbName, ...config}: MongoConfig) {
    const mongo = await new MongoClient(uri, config).connect();

    const db = mongo.db(dbName);
    const productRepo = new MongoDBProductRepository(db);
    const app = await createCatalogApp(productRepo, {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'product-catalog',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'product-catalog-server',
            },
        },
    });
    await app.listen(CATALOG_PORT);
}
