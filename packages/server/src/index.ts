import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import { MongoClient } from "mongodb";
import { MongoDBProductRepository } from "./product.repo";
import { MongoDBOrderRepository } from "./order.repo";
import { createRoutes } from "./routes";

const app = express();

async function startServer() {
  const mongo = await new MongoClient(
    `mongodb://root:password@127.0.0.1?retryWrites=true&writeConcern=majority`
  ).connect();

  const db = mongo.db("store");
  const productRepo = new MongoDBProductRepository(db);
  const orderRepo = new MongoDBOrderRepository(db);

  app.use(bodyParser.json());
  app.use(cors());
  app.use(createRoutes(productRepo, orderRepo));
  app.use(morgan("tiny"));
  app.listen(8080, () => {
    console.log("listening to 8080");
  });
}

void startServer();
