import {faker} from '@faker-js/faker';
import {builderFor} from 'ts-byob';
import {ProductTemplate} from './types';

export const aProduct = builderFor<ProductTemplate>(() => ({
    title: faker.person.fullName(),
    price: Math.round(Math.random() * 1000)
}));
