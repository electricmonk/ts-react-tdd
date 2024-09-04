import {MongoClient} from "mongodb";
import {createCartApp} from "./app";
import {MongoDBOrderRepository} from "../adapters/order.repo";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {CART_CLIENT} from "./kafkaCartManager";
import {MongoConfig} from "../adapters/mongodb.module";
import {CART_PORT} from "../ports";

export async function startCartServer({uri, dbName, ...config}: MongoConfig) {
    const mongo = await new MongoClient(uri, config).connect();

    const db = mongo.db(dbName);
    const orderRepo = new MongoDBOrderRepository(db);
    const clientsModule = ClientsModule.register([
        {
            name: CART_CLIENT,
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: 'cart-client',
                    brokers: ['localhost:9092'],
                },
                consumer: {
                    groupId: 'cart-consumer',
                },
            },
        },
    ]);
    const app = await createCartApp(clientsModule, orderRepo);
    await app.listen(CART_PORT);
}
