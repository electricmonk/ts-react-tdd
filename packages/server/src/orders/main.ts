import {MongoClient} from "mongodb";
import {createOrdersApp} from "./app";
import {MongoDBOrderRepository} from "../adapters/order.repo";

export const ORDERS_PORT = 8082;

async function startServer() {
    const mongo = await new MongoClient(
        `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
    ).connect();

    const db = mongo.db("store");
    const orderRepo = new MongoDBOrderRepository(db);
    const app = await createOrdersApp(orderRepo);
    await app.listen(ORDERS_PORT);
}

void startServer();