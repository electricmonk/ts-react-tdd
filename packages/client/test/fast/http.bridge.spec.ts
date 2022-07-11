import { createServerLogic } from "@ts-react-tdd/server/src/server";
import { aProduct } from "@ts-react-tdd/server/src/types";
import axios from "axios";

import bodyParser from "body-parser";
import express from "express";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";
import { HTTPShopBackend } from "../../src/adapters/HTTPShopBackend";
import { InMemoryOrderRepository, InMemoryProductRepository, unwireHttpCalls, wireHttpCallsTo } from "../../src/adapters/InMemoryServerLogic";



describe('the http bridge', () => {
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


  test('get with string url param', async () => {
    setupRoutes((route) => {
      route.get('/echo/param/:what', (req, res) => {
        const { what } = req.params;

        res.send(what);
      })
    });

    const word = nanoid();
    const res = await axios.get<string>(`http://localhost/echo/param/${word}`);
    expect(res.data).toEqual(word);

  })

  test('keeps state between requests', async () => {
    setupRoutes((route) => {
      let count = 0;
      route.get('/add', (req, res) => {
        count++;
        res.json(count);
      })
    });

    expect((await axios.get<number>(`http://localhost/add`)).data).toBe(1);
    expect((await axios.get<number>(`http://localhost/add`)).data).toBe(2);
    expect((await axios.get<number>(`http://localhost/add`)).data).toBe(3);
  });

  test('status defaults to 200', async () => {
    setupRoutes(route => {
      route.get('/status', (req, res) => {
        res.send('foo')
      })
    })

    expect((await axios.get(`http://localhost/status`)).status).toBe(200);

  })


  test('post sends status code', async () => {
    setupRoutes(route => {
      route.post('/status', (req, res) => {
        const {code} = req.body;
        res.sendStatus(parseInt(code));
      })
    })

    expect((await axios.post(`http://localhost/status`, {code:418})).status).toBe(418);

  })

  test('get sends status code', async () => {
    setupRoutes(route => {
      route.get('/status/:code', (req, res) => {
        const {code} = req.params;
        res.sendStatus(parseInt(code));
      })
    })

    expect((await axios.get(`http://localhost/status/203`)).status).toBe(203);

  })


  test('post sends headers', async () => {
    setupRoutes(route => {
      route.get('/header/', (req, res) => {
        const headers = req.body as Record<string, string>;
        Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
        res.end();
      })
    })
    const res = await axios.post(`http://localhost/header`, {k1: "v1", k2: "v2"});
    expect(res.headers["k1"]).toEqual("v1");
    expect(res.headers["k2"]).toEqual("v2");

  })

})


function setupRoutes(makeRoutes: (router: express.Router) => any) {
  const app = express();
  const router = express.Router();
  makeRoutes(router);
  app.use(bodyParser.json());
  app.use(router);
  wireHttpCallsTo(app);
}
