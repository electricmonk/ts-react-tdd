import { createServerLogic } from "@ts-react-tdd/server/src/server";
import { aProduct } from "@ts-react-tdd/server/src/types";
import axios from "axios";

import express from "express";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";
import { HTTPShopBackend } from "../../src/adapters/HTTPShopBackend";
import { InMemoryOrderRepository, InMemoryProductRepository, unwireHttpCalls, wireHttpCallsTo } from "../../src/adapters/InMemoryServerLogic";


afterEach(unwireHttpCalls);

test('get', async () => {
  const p1 = aProduct();
  const logic = createServerLogic(new InMemoryProductRepository([p1]), new InMemoryOrderRepository());
  wireHttpCallsTo(logic);
  const products = await new HTTPShopBackend('').findAllProducts();
  expect(products).toContainEqual(expect.objectContaining(p1));
})

test('post', async () => {
  const productRepo = new InMemoryProductRepository();
  const logic = createServerLogic(productRepo, new InMemoryOrderRepository());
  wireHttpCallsTo(logic);

  const p1 = aProduct();
  await axios.post(`http://localhost/products/`, p1)
  expect(await productRepo.findAll()).toContainEqual(expect.objectContaining(p1));
})

test('get with cookie', async () => {
  const productRepo = new InMemoryProductRepository();
  const logic = createServerLogic(productRepo, new InMemoryOrderRepository());
  wireHttpCallsTo(logic);

  Cookies.set('foo', 'bar');
  const count = await new HTTPShopBackend('').getCount('foo');
  expect(count).toBe(0);

})

test('get with url param', async () => {
  const app = express();
  const route = express.Router();
  route.get('/echo/param/:what', (req, res) => {
    const {what} = req.params;

    res.send(what);
  })
  app.use(route);
  wireHttpCallsTo(app);

  const word = nanoid();
  const res = await axios.get<string>(`http://localhost/echo/param/${word}`);
  expect(res.data).toEqual(word);

})

test.todo('status code')

