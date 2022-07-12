import { EventEmitter } from "events";
import { Application, Response } from 'express';
import { headersFieldNamesToLowerCase, headersInputToRawArray, normalizeClientRequestArgs, overrideRequests, restoreOverriddenRequests } from 'nock/lib/common';
import { PassThrough } from 'stream';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.Console(),
  ]
});

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

function aFakeResponse(connection: EventEmitter) {
  const headers: Record<string, string> = {}
  let _statusCode: number = 200;
  const responseStream = new PassThrough();

  const res = {
    headers,
    setHeader: (key: string, value: string) => headers[key.toLowerCase()] = value,
    getHeader: (key: string) => headers[key],

    outputData: [],
    _onPendingData: (length: number) => { },

    status: (code: number) => {
      _statusCode = code;
      return res;
    },

    set statusCode(code: number) {
      _statusCode = code;
    },

    get statusCode(): number {
      return _statusCode;
    },

    get rawHeaders(): string[] {
      return headersInputToRawArray(headers);

    },

    end: (chunk: Uint8Array | string) => {
      logger.http('ending response');
      responseStream.write(toBuffer(chunk));
      responseStream.end();
      connection.emit('done');
      logger.http('ended response');
    },
    on: responseStream.on.bind(responseStream),
    once: responseStream.on.bind(responseStream),
    removeAllListeners: responseStream.removeAllListeners.bind(responseStream),
  };

  return res;
}

export function wireHttpCallsTo(logic: Application) {
  global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;

  overrideRequests(function (proto: string, overriddenRequest: unknown, rawArgs: unknown[]) {
    let invoked = false;
    try {
      const connection = new EventEmitter();
      const bodyStream = new PassThrough();
      const { options, callback } = normalizeClientRequestArgs(...rawArgs);

      const expressRequest = aFakeRequest(options, bodyStream);
      const expressResponse = aFakeResponse(connection);

      function invokeServer() {
        if (!invoked) {
          invoked = true;
          logic(expressRequest, expressResponse as unknown as Response )
          logger.http('server invoked');
        }
      }

      function respond() {
        logger.http('calling callback');
        callback.bind(overriddenRequest)(expressResponse)
        logger.http('called callback');
      }

      connection.once('flush', invokeServer);
      connection.once('done', respond);
      
      // setTimeout(invokeServer, 0); // so that the calling code can subscribe to calls before we execute the logic TODO consider doing this in an event handler
      
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
          connection.emit('flush')
          bodyStream.end();
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