import { Collection, Db, ObjectId, WithId } from "mongodb";
import { Product, ProductTemplate } from "../types";
import {Injectable} from "@nestjs/common";

const docToProduct = ({_id, ...rest}: WithId<ProductTemplate>) => Product.parse({id: _id.toString(), ...rest});

@Injectable()
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

    async findById(productId: string): Promise<Product | undefined> {
        return this.products.findOne({_id: {$eq: new ObjectId(productId)}})
            .then(doc => doc ? docToProduct(doc) : undefined)
    }
}

export type ProductRepository = Omit<MongoDBProductRepository, "products">;