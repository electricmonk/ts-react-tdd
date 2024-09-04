import {MongoClient} from "mongodb";
import {MongoDBProductRepository} from "../adapters/product.repo";
import {createCatalogApp} from "./app";
import {Transport} from "@nestjs/microservices";

export const CATALOG_PORT = 8081;

async function startServer() {
    const mongo = await new MongoClient(
        `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
    ).connect();

    const db = mongo.db("store");
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

void startServer();