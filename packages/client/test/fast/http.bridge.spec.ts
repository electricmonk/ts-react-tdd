import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import Cookies from "js-cookie";
import { unwireHttpCalls, wireHttpCallsTo } from "../../src/adapters/express.http.bridge";

const cases: Case[] = [
  get('json', {
    handler: (req, res) => res.json({foo: "bar"}), 
    responseMatch: {data: {foo: "bar"}}
  }),
  post('echo json', {
    handler: (req, res) => res.json(req.body), 
    requestOptions: {data: {foo: "bar"}}, 
    responseMatch: {data: {foo: "bar"}}
  }),
  get('with url param', {
    path: "/:what", 
    handler: (req, res) => res.send(req.params.what), 
    requestOptions: {url: "/foobarbaz"}, 
    responseMatch: {data: "foobarbaz"}
  }),
  get('status defaults to 200', {
    handler: (req, res) => res.send('foo'), 
    responseMatch: {status: 200}
  }),
  post('sends status code', {
    handler: (req, res) => res.sendStatus(201), 
    responseMatch: {status: 201}
  }),
  get('echoes headers', {
    handler: (req, res) => {
      res
        .set(Object.fromEntries(Object.entries(req.headers).filter(([key]) => key.startsWith('x-'))))
        .end()
    },
    requestOptions: {headers: {"x-foo": "foo", "x-bar": "baz"}},
    responseMatch: {headers: expect.objectContaining({"x-foo": "foo", "x-bar": "baz"})},
  }),
];

type Method = 'post' | 'get';
type Case = {
  method: Method,
  description: string,
  path?: string,
  handler: (req: express.Request, res: express.Response) => void,
  requestOptions?: AxiosRequestConfig,
  responseMatch: Partial<AxiosResponse>,
  toString: () => string,
}

function get(description: string, testCase: Omit<Case, "description" | "method">): Case {
  return {description, method: 'get', ...testCase, toString: () => `get ${description}`}
}

function post(description: string, testCase: Omit<Case, "description" | "method">): Case {
  return {description, method: 'post', ...testCase, toString: () => `post ${description}`}
}


afterEach(unwireHttpCalls);

describe.each(['http', 'https'])('%s', (proto) => {
  const baseURL = `${proto}://localhost`;
  
  test.each(cases)('%s', async ({method, path, handler, requestOptions, responseMatch}) => {

    const request = axios.create({baseURL});
  
    setupRoutes((route) => {
      switch (method) {
        case 'get':
          route.get(path || '/', handler);
          break;
       case 'post':
          route.post(path || '/', handler);
          break;
        default:
          throw new Error('unsupported method ' + method)
      }
    });
  
    const options = {
      url: '/',
      method,
      ...requestOptions,
    }
    
    await expect(request(options)).resolves.toEqual(expect.objectContaining(responseMatch));
  })

  test.skip('get and set cookies', async () => {  // fails because node_modules/jsdom/lib/jsdom/living/helpers/http-request.js thinks response.headers["set-cookie"] is an array
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
    await expect(axios.get(`${proto}://localhost/cookie`)).resolves.toEqual(expect.objectContaining({headers: expect.objectContaining({"set-cookie": `${cookieName}=baz`})}));

  })


  test('keeps state between requests', async () => {
    setupRoutes((route) => {
      let count = 0;
      route.get('/add', (req, res) => {
        count++;
        res.json(count);
      })
    });
    await expect(axios.get(`${proto}://localhost/add`)).resolves.toEqual(expect.objectContaining({data: 1}));
    await expect(axios.get(`${proto}://localhost/add`)).resolves.toEqual(expect.objectContaining({data: 2}));
    await expect(axios.get(`${proto}://localhost/add`)).resolves.toEqual(expect.objectContaining({data: 3}));
  });


})



function setupRoutes(makeRoutes: (router: express.Router) => any) {
  const app = express();
  const router = express.Router();
  makeRoutes(router);
  app.use(cors());
  app.use(cookieParser())
  app.use(bodyParser.json());
  app.use(router);
  wireHttpCallsTo(app);
}
