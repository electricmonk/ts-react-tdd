import faker from "@faker-js/faker";

export interface Order {
    id: string;
    products: Product[];
}

export interface Product {
    id: string;
    title: string;
}

export const aProduct = (overrides: Partial<Product> = {}) => {
    return {title: faker.name.findName(), ...overrides}
}