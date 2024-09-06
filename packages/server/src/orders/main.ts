import {MongoClient} from "mongodb";
import {createOrdersApp} from "./app";
import {MongoDBOrderRepository} from "../adapters/order.repo";
import {Transport} from "@nestjs/microservices";
import {MongoConfig} from "../adapters/mongodb.module";
import {ORDERS_PORT} from "../ports";

export async function startOrdersServer({uri, dbName, ...config}: MongoConfig) {
    const mongo = await new MongoClient(uri, config).connect();
    const db = mongo.db(dbName);
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