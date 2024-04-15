import { MongoClient } from "mongodb";
import { MongoDBOrderRepository } from "./adapters/order.repo";
import { MongoDBProductRepository } from "./adapters/product.repo";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function startServer() {
  const mongo = await new MongoClient(
    `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
  ).connect();

  const db = mongo.db("store");
  const productRepo = new MongoDBProductRepository(db);
  const orderRepo = new MongoDBOrderRepository(db);

  const app = await NestFactory.create(AppModule.register(productRepo, orderRepo))
  app.enableCors({origin: "*"});
  await app.listen(8080);
}

void startServer();


