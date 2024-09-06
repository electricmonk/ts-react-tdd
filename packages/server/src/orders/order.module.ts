import {ORDER_REPO} from "../adapters";
import {DynamicModule} from "@nestjs/common";
import {OrderRepository} from "../adapters/order.repo";
import {OrderController} from "./orderController";


export class OrderModule {
    static register(orderRepo: OrderRepository): DynamicModule {
        return {
            module: OrderModule,
            providers: [
                {
                    provide: ORDER_REPO,
                    useValue: orderRepo
                },
            ],
            controllers: [OrderController]

        }
    }
}