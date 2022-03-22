import faker from "@faker-js/faker";
import {nanoid} from "nanoid";
import {Product} from "@ts-react-tdd/server/types";

export interface ProductCatalog {
    findAllProducts(): Promise<Product[]>;
}

export const aProduct = (overrides: Partial<Product> = {}) => {
    return { title: faker.name.findName(), id: nanoid(), ...overrides}
}

