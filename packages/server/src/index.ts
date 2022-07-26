import { MongoClient } from "mongodb";
import { MongoDBOrderRepository } from "./adapters/order.repo";
import { MongoDBProductRepository } from "./adapters/product.repo";
import { createServerLogic } from "./server";

async function startServer() {
  const mongo = await new MongoClient(
    `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
  ).connect();

  const db = mongo.db("store");
  const productRepo = new MongoDBProductRepository(db);
  const orderRepo = new MongoDBOrderRepository(db);

  const app = createServerLogic(productRepo, orderRepo);
  app.listen(8080, () => {
    console.log("listening to 8080");
  });
}

void startServer();


