import Fastify, {FastifyHttpOptions} from "fastify";
import cors from "@fastify/cors";
import { createRoutes, OrderRepository, ProductRepository } from "./routes";

export function createServerLogic(productRepo: ProductRepository, orderRepo: OrderRepository, opts?: FastifyHttpOptions<any>) {
  const fastify = Fastify(opts);
  fastify.register(cors);
  fastify.register(createRoutes(productRepo, orderRepo));
  return fastify;
}
