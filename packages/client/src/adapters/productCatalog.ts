import {Product} from "@ts-react-tdd/server/src/types";

export interface ProductCatalog {
    findAllProducts(): Promise<Product[]>;
}

