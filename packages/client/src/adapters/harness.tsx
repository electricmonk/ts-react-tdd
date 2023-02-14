import { render } from "@testing-library/react";
import { InMemoryOrderRepository, InMemoryProductRepository } from "@ts-react-tdd/server/src/adapters/fakes";
import { createServerLogic } from "@ts-react-tdd/server/src/server";
import { ProductTemplate } from "@ts-react-tdd/server/src/types";
import { Express } from 'express';
import { AddressInfo } from 'net';
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { App } from "../components/App";
import { IOContextProvider } from "./context";

type Driver = ReturnType<typeof render> & {
}

export async function makeApp(products: ProductTemplate[] = []) {
  const productRepo = new InMemoryProductRepository(products);
  const logic = createServerLogic(productRepo, new InMemoryOrderRepository());
  const queryClient = new QueryClient();

  const { baseUrl, close } = await startServer(logic);

  const runInHarness = async (testFn: (app: Driver) => Promise<any>) => {
    const app = render(<MemoryRouter><IOContextProvider backendUrl={baseUrl}> <QueryClientProvider client={queryClient}><App/></QueryClientProvider></IOContextProvider > </MemoryRouter>);

    const driver = {
      ...app,
    };

    try {
      await testFn(driver);
    } finally {
      close();
    }
  };

  return {
    productRepo,
    runInHarness
  };
}

function startServer(app: Express) {
  return new Promise<{ close: VoidFunction, baseUrl: string }>(resolve => {
    const server = app.listen(0, () => {
      const port = (server.address() as AddressInfo).port;
      resolve({
        close: server.close.bind(server),
        baseUrl: `http://localhost:${port}`,
      })
    });
  });
}

