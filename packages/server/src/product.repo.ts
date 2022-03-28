import {Collection, Db, ObjectId, WithId} from "mongodb";
import {Product} from "./types";

type MongoProduct = Omit<Product, "id">;
const docToProduct = ({_id, ...rest}: WithId<MongoProduct>) => ({id: _id.toString(), ...rest});

export class MongoDBProductRepository {
    private products: Collection<MongoProduct>;

    constructor(db: Db) {
        this.products = db.collection("products");
    }


    async create(fields: MongoProduct): Promise<Product> {
        const id = new ObjectId();
        await this.products.insertOne({_id: id, ...fields});
        return {
            id: id.toString(),
            ...fields,
        }
    }

    async findAll(): Promise<Product[]> {
        return this.products.find()
            .map(docToProduct)
            .toArray();
    }

    async findByIds(productIds: string[]): Promise<Product[]> {
        return this.products.find({_id: {$in: productIds.map(id => new ObjectId(id))}})
            .map(docToProduct)
            .toArray();
    }
}