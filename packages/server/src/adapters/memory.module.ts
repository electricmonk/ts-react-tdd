import {DynamicModule} from "@nestjs/common";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./index";
import {MemoryCartRepository} from "./cart.repo";
import {InMemoryOrderRepository, InMemoryProductRepository} from "./fake";
import {ProductTemplate} from "../types";


export class MemoryModule {
    static forTests(products: ProductTemplate[]): DynamicModule {
        return {
            module: MemoryModule,
            providers: [

                {
                    provide: PRODUCT_REPO,
                    useValue: new InMemoryProductRepository(products)
                },
                {
                    provide: ORDER_REPO,
                    useClass: InMemoryOrderRepository,
                },
                {
                    provide: CART_REPO,
                    useClass: MemoryCartRepository,
                }
            ],
            exports: [PRODUCT_REPO, ORDER_REPO, CART_REPO]
        }
    }
}