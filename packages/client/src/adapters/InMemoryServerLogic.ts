import { OrderRepository, ProductRepository } from "@ts-react-tdd/server/src/routes";
import { createServerLogic } from "@ts-react-tdd/server/src/server";
import { Order, Product } from "@ts-react-tdd/server/src/types";
import { EventEmitter } from 'events';
import { Application, Response } from 'express';
import { nanoid } from "nanoid";
import { headersFieldNamesToLowerCase, headersInputToRawArray, normalizeClientRequestArgs, overrideRequests, restoreOverriddenRequests } from 'nock/lib/common';
import { PassThrough } from 'stream';
import { HTTPShopBackend } from "./HTTPShopBackend";

type ProductTemplate = Omit<Product,"id">
export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = []

  constructor(products: ProductTemplate[] = []) {
    products.forEach(p => this.create(p));
  }
  
  async findById(productId: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === productId);
  }
  
  async create(template: Omit<Product, "id">): Promise<Product> {
    const product = {...template, id: nanoid()};
    this.products.push(product);
    return product;
  }
  async findAll(): Promise<Product[]> {
    return this.products;
  }
}

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created = {...order, id: nanoid()};
    this.orders.push(created);
    return created;
  } 

  async findById(orderId: string): Promise<Order | null> {
    return this.orders.find(({id}) => id === orderId) || null;
  }
  
}

function toBuffer(chunk: unknown): Buffer {

  switch (typeof chunk) {
    // string defaulting to html
    case 'string':
      return Buffer.from(chunk);
    case 'boolean':
    case 'number':
    case 'object':
      if (Buffer.isBuffer(chunk)) {
        return chunk;
      } else {
        return Buffer.from(JSON.stringify(chunk));
      }
    default:
      return Buffer.from('');
  }
}

function aFakeRequest(options: any, bodyStream: PassThrough) {
  const expressRequest = {
    ...options,
    headers: headersFieldNamesToLowerCase(options.headers),
    url: options.href,
  };

  Object.assign(expressRequest, bodyStream);
  return expressRequest;
}

function aFakeResponse() {
  const headers: Record<string, string> = {}
  let statusCode: number = 200;
  const responseEmitter = new EventEmitter();

  const res = {
    headers,
    setHeader: (key: string, value: string) => headers[key] = value,
    getHeader: (key: string) => headers[key],

    outputData: [],
    _onPendingData: (length: number) => { },

    status: (code: number) => {
      statusCode = code;
      return res;
    },

    end: (chunk: Uint8Array | string) => {
      responseEmitter.emit('data', toBuffer(chunk));
      responseEmitter.emit('end');
    },

    toXHRResponse: () => ({
      headers,
      rawHeaders: headersInputToRawArray(headers),
      statusCode,
      on: responseEmitter.on.bind(responseEmitter),
      once: responseEmitter.on.bind(responseEmitter),
      removeAllListeners: responseEmitter.removeAllListeners.bind(responseEmitter),
    })
  };

  return res;
}

export function wireHttpCallsTo(logic: Application) {
  global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;

  overrideRequests(function (proto: string, overriddenRequest: unknown, rawArgs: unknown[]) {

    try {
      const bodyStream = new PassThrough();
      const { options, callback } = normalizeClientRequestArgs(...rawArgs);

      const expressRequest = aFakeRequest(options, bodyStream);
      const expressResponse = aFakeResponse();

      setTimeout(() => logic(expressRequest, expressResponse as unknown as Response ), 0); // so that the calling code can subscribe to calls before we execute the logic TODO consider doing this in an event handler

      return {
        on: (event: string, callback: () => any) => { 
        },
        removeAllListeners: () => { },
        getHeader: expressResponse.getHeader,
        setHeader: (key: string, value: string) => expressRequest.headers[key.toLowerCase()] = value,
        destroy: () => { },
        write: (data: any, encoding: BufferEncoding) => {
          bodyStream.write(data, encoding);
        },
        end: () => {
          bodyStream.end();
          const httpResponse = expressResponse.toXHRResponse(); // at this point headers have been sent so it's ok to create rawHeaders
          callback.bind(overriddenRequest)(httpResponse);
        },
      };

    } catch (err) {
      console.error(err);
    }
  });
}

export function unwireHttpCalls() {
  restoreOverriddenRequests();
}
export function inMemoryServerLogic(products: ProductTemplate[] = []): {backend: HTTPShopBackend, createProduct: ProductRepository["create"]} {
  const productRepo = new InMemoryProductRepository(products);
  const logic = createServerLogic(productRepo, new InMemoryOrderRepository());
  wireHttpCallsTo(logic);
  return {
        backend: new HTTPShopBackend(''),
        createProduct: productRepo.create.bind(productRepo),
  };
}

