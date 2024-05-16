import {MongoClient, MongoClientOptions} from "mongodb";
import {DynamicModule} from "@nestjs/common";
import {CART_REPO, ORDER_REPO, PRODUCT_REPO} from "./index";
import {MongoDBProductRepository} from "./product.repo";
import {MongoDBOrderRepository} from "./order.repo";
import {MemoryCartRepository} from "./cart.repo";

type Config = {
    uri: string;
    dbName: string;
} & Pick<MongoClientOptions, 'connectTimeoutMS' | 'serverSelectionTimeoutMS' | 'socketTimeoutMS'>

export class MongoDBModule {
    static forRoot({uri, dbName, ...config}: Config): DynamicModule {

        return {
            module: MongoDBModule,
            providers: [
                {
                    provide: "storeDB",
                    useFactory: async () => {
                        const mongo = await new MongoClient(uri, config).connect();

                        return mongo.db(dbName);
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
