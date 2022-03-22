import faker from "@faker-js/faker";
import {nanoid} from "nanoid";

export interface ProductCatalog {
    findAllProducts(): Promise<Product[]>;
}

export interface Product {
    id: string;
    title: string;
}


export const aProduct = (overrides: Partial<Product> = {}) => {
    return { title: faker.name.findName(), id: nanoid(), ...overrides}
}

