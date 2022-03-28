import {Product} from "@ts-react-tdd/server/types";

export interface ProductCatalog {
    findAllProducts(): Promise<Product[]>;
}

