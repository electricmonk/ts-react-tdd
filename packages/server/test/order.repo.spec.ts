import { MongoClient } from "mongodb";
import { nanoid } from "nanoid";
import { InMemoryOrderRepository } from "../src/adapters/fakes";
import { MongoDBOrderRepository } from "../src/adapters/order.repo";
import { OrderRepository } from "../src/routes";


type Adapter = [string, () => Promise<{repo: OrderRepository, close: () => any}>]

const adapters: Adapter[] = [
    ["mongodb", async () => {
        const mongo = await new MongoClient(`mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`).connect();
        const repo = new MongoDBOrderRepository(mongo.db());
        return {
            repo,
            close: mongo.close.bind(mongo)
        }
    }],
    ["memory", async () => ({
        repo: new InMemoryOrderRepository(),
        close: () => {},
    })]
]

describe.each(adapters)('the %s order repository', (_, makeRepo) => {

    it('finds product by id', async () => {
        const { repo, close } = await makeRepo();

        const order = await repo.create({items: [{productId: nanoid(), name: "foo", price: 666}]});
        await expect(repo.findById(order.id)).resolves.toEqual(order);

        return close();
    });

})