import {Product} from "@ts-react-tdd/server/src/types";

export interface ProductCatalog {
    findAllProducts(): Promise<Product[]>;
    searchProducts(freeTextSearch: string): Promise<Product[]>;
}

