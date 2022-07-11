import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { createRoutes, OrderRepository, ProductRepository } from "./routes";

export function createServerLogic(productRepo: ProductRepository, orderRepo: OrderRepository) {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use(createRoutes(productRepo, orderRepo));
  app.use(morgan("tiny"));
  return app;
}
