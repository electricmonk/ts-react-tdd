import {MongoClient} from "mongodb";
import {createOrdersApp} from "./app";
import {MongoDBOrderRepository} from "../adapters/order.repo";
import {Transport} from "@nestjs/microservices";

export const ORDERS_PORT = 8082;

async function startServer() {
    const mongo = await new MongoClient(
        `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
    ).connect();

    const db = mongo.db("store");
    const orderRepo = new MongoDBOrderRepository(db);
    const app = await createOrdersApp(orderRepo, {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'orders',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'orders-server',
            },
        },
    });
    await app.listen(ORDERS_PORT);
}

void startServer();