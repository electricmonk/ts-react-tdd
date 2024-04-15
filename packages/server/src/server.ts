import Fastify, {FastifyHttpOptions} from "fastify";
import cors from "@fastify/cors";
import { createRoutes } from "./routes";
import {ProductTemplate} from "./types";
import { ProductRepository } from "./adapters/product.repo";
import {OrderRepository} from "./adapters/order.repo";

export function createServerLogic(productRepo: ProductRepository, orderRepo: OrderRepository, opts?: FastifyHttpOptions<any>) {
  const fastify = Fastify(opts);
  fastify.register(cors);
  fastify.register(createRoutes(productRepo, orderRepo));
  return fastify;
}

export function createTestingModule(products: ProductTemplate[] = []) {

}