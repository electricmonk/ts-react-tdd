import { Collection, Db, ObjectId, WithId } from "mongodb";
import { Order } from "../types";
import {Injectable} from "@nestjs/common";

type MongoOrder = Omit<Order, "id">;
const docToOrder = ({_id, ...rest}: WithId<MongoOrder>) => Order.parse({id: _id.toString(), ...rest});

@Injectable()
export class MongoDBOrderRepository {
    private orders: Collection<MongoOrder>;

    constructor(db: Db) {
        this.orders = db.collection("orders");
    }

    async create(order: MongoOrder): Promise<Order> {
        const res = await this.orders.insertOne({_id: new ObjectId(), ...order});
        return {
            id: res.insertedId.toString(),
            ...order
        }
    }

    async findById(orderId: string): Promise<Order | null> {
        return this.orders.findOne({_id: {$eq: new ObjectId(orderId)}})
            .then(doc => doc ? docToOrder(doc) : null)
    }
}

export type OrderRepository = Omit<MongoDBOrderRepository, "orders">;