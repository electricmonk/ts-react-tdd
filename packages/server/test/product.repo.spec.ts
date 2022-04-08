import {MongoDBProductRepository} from "../src/product.repo";
import {MongoClient, ObjectId} from "mongodb";
import {aProduct} from "../src/types";

describe('the mongodb product repository', () => {
    it('finds an array of products by ids', async() => {
        const mongo = await new MongoClient(`mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`).connect();
        const repo = new MongoDBProductRepository(mongo.db());

        const p1 = await repo.create(aProduct());
        const p2 = await repo.create(aProduct());
        const p3 = await repo.create(aProduct());

        const found = await repo.findByIds([p1.id, p2.id, new ObjectId().toString()])
        expect(found).toHaveLength(2);
        expect(found).toContainEqual(p1);
        expect(found).toContainEqual(p2);
        expect(found).not.toContainEqual(p3);
    })
})