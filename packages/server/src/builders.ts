import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { builderFor } from 'ts-byob';
import { CartSummary, ProductTemplate } from './types';

export const aProduct = builderFor<ProductTemplate>(() => ({title: faker.name.fullName(), price: Math.round(Math.random() * 1000)}));
export const aCart = builderFor<CartSummary>(() => ({id: nanoid(), items: []}));
export const anEmptyCart = (id: string) => aCart({id});
