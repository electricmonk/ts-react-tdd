import {DynamicModule} from "@nestjs/common";
import {CART_REPO} from "../adapters";
import {MemoryCartRepository} from "../adapters/cart.repo";
import {KafkaCartManager} from "./kafkaCartManager";
import {CartController} from "./cartController";

export class CartModule {
    static register(clientsModule: DynamicModule): DynamicModule {
        return {
            module: CartModule,
            imports: [clientsModule],
            providers: [
                {
                    provide: CART_REPO,
                    useClass: MemoryCartRepository,
                },
                KafkaCartManager,
            ],
            controllers: [CartController]

        }
    }
}