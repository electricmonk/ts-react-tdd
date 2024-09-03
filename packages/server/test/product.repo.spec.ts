import { MongoClient } from "mongodb";
import { InMemoryProductRepository } from "../src/adapters/fake";
import {MongoDBProductRepository } from "../src/adapters/product.repo";
import { aProduct } from "../src/builders";
import {describe, it, expect} from 'vitest';

const adapters = [
    {name: "mongodb", makeRepo: async () => {
        const mongo = new MongoClient(`mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`);
        await mongo.connect();
        const repo = new MongoDBProductRepository(mongo.db());
        return {
            repo,
            close: mongo.close.bind(mongo)
        }
    }},
    {name: "memory", makeRepo: async () => ({
        repo: new InMemoryProductRepository(),
        close: () => {},
    })}
]

describe.each(adapters)('the $name product repository', ({makeRepo}) => {

    it('finds product by id', async () => {
        const { repo, close } = await makeRepo();

        const p1 = await repo.create(aProduct());
        await expect(repo.findById(p1.id)).resolves.toEqual(p1);

        return close();
    });

    it('finds all products', async () => {
        const { repo, close } = await makeRepo();

        const p1 = await repo.create(aProduct());
        const p2 = await repo.create(aProduct());
        const p3 = await repo.create(aProduct());

        const found = await repo.findAll();
        expect(found).toContainEqual(p1);
        expect(found).toContainEqual(p2);
        expect(found).toContainEqual(p3);

        return close();
    });

    it('finds products matching a title query', async () => {
        const { repo, close } = await makeRepo();

        const p1 = await repo.create(aProduct({title: "foo"}));
        const p2 = await repo.create(aProduct({title: "bar"}));
        const p3 = await repo.create(aProduct({title: "food"}));

        const found = await repo.findByTitle("foo");
        expect(found).toContainEqual(p1);
        expect(found).not.toContainEqual(p2);
        expect(found).toContainEqual(p3);

        return close();
    });
})