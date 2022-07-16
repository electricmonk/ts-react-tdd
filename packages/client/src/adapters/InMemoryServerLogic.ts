import { createServerLogic } from "@ts-react-tdd/server/src/server";
import {  ProductTemplate } from "@ts-react-tdd/server/src/types";
import {  InMemoryProductRepository, InMemoryOrderRepository } from "@ts-react-tdd/server/src/adapters/fakes";
import { unwireHttpCalls, wireHttpCallsTo } from "azzarqa";
import { HTTPShopBackend } from "./HTTPShopBackend";

export function inMemoryServerLogic(products: ProductTemplate[] = []) {
  const productRepo = new InMemoryProductRepository(products);
  const logic = createServerLogic(productRepo, new InMemoryOrderRepository());
  wireHttpCallsTo(logic);
  return {
        backend: new HTTPShopBackend(''),
        createProduct: productRepo.create.bind(productRepo),
        unwire: unwireHttpCalls,
  };
}

