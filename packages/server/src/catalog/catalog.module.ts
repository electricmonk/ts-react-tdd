import {ProductRepository} from "../adapters/product.repo";
import {ProductController} from "./productController";
import {PRODUCT_REPO} from "../adapters";
import {DynamicModule} from "@nestjs/common";


export class CatalogModule {
    static register(productRepo: ProductRepository): DynamicModule {
        return {
            module: CatalogModule,
            providers: [
                {
                    provide: PRODUCT_REPO,
                    useValue: productRepo
                },
            ],
            controllers: [ProductController]

        }
    }
}