import { Collection, Db, ObjectId, WithId } from "mongodb";
import { Product, ProductTemplate } from "../types";

const docToProduct = ({_id, ...rest}: WithId<ProductTemplate>) => ({id: _id.toString(), ...rest});

export class MongoDBProductRepository {
    private products: Collection<ProductTemplate>;

    constructor(db: Db) {
        this.products = db.collection("products");
    }


    async create(fields: ProductTemplate): Promise<Product> {
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

    async findById(productId: string): Promise<Product | undefined> {
        return this.products.findOne({_id: {$eq: new ObjectId(productId)}})
            .then(doc => doc ? docToProduct(doc) : undefined)
    }
}


  