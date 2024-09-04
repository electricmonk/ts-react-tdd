import {MongoClient} from "mongodb";
import {MongoDBProductRepository} from "../adapters/product.repo";
import {createCatalogApp} from "./app";

export const CATALOG_PORT = 8081;

async function startServer() {
    const mongo = await new MongoClient(
        `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
    ).connect();

    const db = mongo.db("store");
    const productRepo = new MongoDBProductRepository(db);
    const app = await createCatalogApp(productRepo);
    await app.listen(CATALOG_PORT);
}

void startServer();