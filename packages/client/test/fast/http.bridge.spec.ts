import axios from "axios";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import Cookies from "js-cookie";
import { nanoid } from "nanoid";
import { unwireHttpCalls, wireHttpCallsTo } from "../../src/adapters/express.http.bridge";

describe('the http bridge', () => {
  afterEach(unwireHttpCalls);

  test('get json', async () => {
    const obj = {foo: "bar"};

    setupRoutes((route) => {
      route.get('/json', (req, res) => {
        res.json(obj);
      })
    });

    await expect(axios.get(`http://localhost/json`)).resolves.toEqual(expect.objectContaining({data: obj}));
  })

  test('post json', async () => {
    setupRoutes((route) => {
      route.post('/echo/json', (req, res) => {
        res.json(req.body);
      })
    });

    const data = {foo: "bar"};

    await expect(axios.post(`http://localhost/echo/json`, data)).resolves.toEqual(expect.objectContaining({data}));

  })

  // fails because node_modules/jsdom/lib/jsdom/living/helpers/http-request.js thinks response.headers["set-cookie"] is an array
  test.skip('get and set cookies', async () => {
    const cookieName = 'fookie';

    setupRoutes((route) => {
      route.get('/cookie', (req, res) => {
        if (req.cookies[cookieName] != 'bar') {
          res.sendStatus(400);
        } else {          
          res.cookie(cookieName, 'baz', { httpOnly: false }).sendStatus(200);
        }
      })
    });

    Cookies.set(cookieName, 'bar');
    await expect(axios.get(`http://localhost/cookie`)).resolves.toEqual(expect.objectContaining({headers: expect.objectContaining({"set-cookie": `${cookieName}=baz`})}));

  })


  test('get with string url param', async () => {
    setupRoutes((route) => {
      route.get('/echo/param/:what', (req, res) => {
        const { what } = req.params;

        res.send(what);
      })
    });

    const word = nanoid();
    await expect(axios.get(`http://localhost/echo/param/${word}`)).resolves.toEqual(expect.objectContaining({data: word}));
  })

  test('keeps state between requests', async () => {
    setupRoutes((route) => {
      let count = 0;
      route.get('/add', (req, res) => {
        count++;
        res.json(count);
      })
    });
    await expect(axios.get(`http://localhost/add`)).resolves.toEqual(expect.objectContaining({data: 1}));
    await expect(axios.get(`http://localhost/add`)).resolves.toEqual(expect.objectContaining({data: 2}));
    await expect(axios.get(`http://localhost/add`)).resolves.toEqual(expect.objectContaining({data: 3}));
  });

  test('status defaults to 200', async () => {
    setupRoutes(route => {
      route.get('/status', (req, res) => {
        res.send('foo')
      })
    })

    await expect(axios.get(`http://localhost/status`)).resolves.toEqual(expect.objectContaining({status: 200}));

  })


  test('post sends status code', async () => {
    setupRoutes(route => {
      route.post('/status', (req, res) => {
        const {status} = req.body;
        res.sendStatus(parseInt(status));
      })
    })

    const status = 201;
    await expect(axios.post(`http://localhost/status`, {status})).resolves.toEqual(expect.objectContaining({status}));

  })

  test('get sends status code', async () => {
    setupRoutes(route => {
      route.get('/status/:status', (req, res) => {
        const {status} = req.params;
        res.sendStatus(parseInt(status));
      })
    })

    const status = 203;
    await expect(axios.get(`http://localhost/status/${status}`)).resolves.toEqual(expect.objectContaining({status}));

  })


  test('echoes headers', async () => {
    setupRoutes(route => {
      route.get('/echo/headers', (req, res) => {
        res
          .set(Object.fromEntries(Object.entries(req.headers).filter(([key]) => key.startsWith('x-'))))
          .end();
      })
    })

    const headers =  {"x-foo": "foo", "x-bar": "baz"};
    expect(axios.get(`http://localhost/echo/headers`, {headers})).resolves.toEqual(expect.objectContaining({headers: expect.objectContaining(headers)}));
  })

})


function setupRoutes(makeRoutes: (router: express.Router) => any) {
  const app = express();
  const router = express.Router();
  makeRoutes(router);
  app.use(cookieParser())
  app.use(bodyParser.json());
  app.use(router);
  wireHttpCallsTo(app);
}
