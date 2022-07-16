import {Collection, Db, ObjectId, WithId} from "mongodb";
import {Order} from "../types";

type MongoOrder = Omit<Order, "id">;
const docToOrder = ({_id, ...rest}: WithId<MongoOrder>) => ({id: _id.toString(), ...rest});

export class MongoDBOrderRepository {
    private orders: Collection<MongoOrder>;

    constructor(db: Db) {
        this.orders = db.collection("orders");
    }

    async create(order: MongoOrder): Promise<Order> {
        const res = await this.orders.insertOne(order);
        return {
            id: res.insertedId.toString(),
            ...order
        }
    }

    async findById(orderId: string): Promise<Order | null> {
        const order = await this.orders.findOne({_id: new ObjectId(orderId)})
        return order && docToOrder(order);
    }
}