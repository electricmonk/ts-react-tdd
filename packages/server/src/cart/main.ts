import {createCartApp} from "./app";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {CART_CLIENT} from "./kafkaCartManager";
import {CART_PORT} from "../ports";

export async function startCartServer() {
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
    const app = await createCartApp(clientsModule);
    await app.listen(CART_PORT);
}
