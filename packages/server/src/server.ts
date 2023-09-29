import Fastify from "fastify";
import cors from "@fastify/cors";
import { createRoutes, OrderRepository, ProductRepository } from "./routes";

export function createServerLogic(productRepo: ProductRepository, orderRepo: OrderRepository) {
  const fastify = Fastify({logger: true});
  fastify.register(cors);
  fastify.register(createRoutes(productRepo, orderRepo));
  return fastify;
}
