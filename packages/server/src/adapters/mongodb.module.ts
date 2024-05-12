import {MongoClient} from "mongodb";
import {DynamicModule} from "@nestjs/common";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./index";
import {MongoDBProductRepository} from "./product.repo";
import {MongoDBOrderRepository} from "./order.repo";
import {MemoryCartRepository} from "./cart.repo";

export class MongoDBModule {
    static forRoot(uri: string): DynamicModule {

        return {
            module: MongoDBModule,
            providers: [
                {
                    provide: "storeDB",
                    useFactory: async () => {
                        const mongo = await new MongoClient(uri, {
                            connectTimeoutMS: 100,
                            serverSelectionTimeoutMS: 100,
                            socketTimeoutMS: 100
                        }).connect();

                        return mongo.db("store");
                    },
                },
                {
                    provide: PRODUCT_REPO,
                    useClass: MongoDBProductRepository
                },
                {
                    provide: ORDER_REPO,
                    useClass: MongoDBOrderRepository,
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