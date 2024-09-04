import {MongoClient} from "mongodb";
import {createCartApp} from "./app";
import {MongoDBOrderRepository} from "../adapters/order.repo";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {CART_CLIENT} from "./cartManager";

export const CART_PORT = 8082;

async function startServer() {
    const mongo = await new MongoClient(
        `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
    ).connect();

    const db = mongo.db("store");
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

void startServer();