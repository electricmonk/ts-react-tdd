import {render, within} from "@testing-library/react";
import {InMemoryOrderRepository, InMemoryProductRepository} from "@ts-react-tdd/server/src/adapters/fakes";
import {createServerLogic} from "@ts-react-tdd/server/src/server";
import {Express} from 'express';
import {AddressInfo} from 'net';
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import {App} from "../components/App";
import {IOContextProvider} from "./context";
import userEvent from "@testing-library/user-event";

type Driver = ReturnType<typeof render> & {
  addProductToCart: (title: string) => Promise<void>;
  viewCart: () => Promise<void>;
  checkout: () => Promise<void>;
  home: () => Promise<void>;
}

type AppContext = {
  productRepo?: InMemoryProductRepository,
  orderRepo?: InMemoryOrderRepository
};

export async function makeApp({
  productRepo = new InMemoryProductRepository(),
  orderRepo = new InMemoryOrderRepository()}: AppContext) {
  const logic = createServerLogic(productRepo, orderRepo);
  const queryClient = new QueryClient();

  const { baseUrl, close } = await startServer(logic);

  const runInHarness = async (testFn: (app: Driver) => Promise<any>) => {
    const app = render(<MemoryRouter><IOContextProvider backendUrl={baseUrl}> <QueryClientProvider client={queryClient}><App/></QueryClientProvider></IOContextProvider > </MemoryRouter>);

    const addProductToCart = async (title: string) => {
      const product = await app.findByLabelText(title)
      const add = within(product).getByText("Add");
      await userEvent.click(add);
    }

    const viewCart = async () => {
      await userEvent.click(await app.findByText("View cart"));
    }

    const checkout = async () => {
      await userEvent.click(app.getByText("Checkout"));
    }

    const home = async () => {
      await userEvent.click(app.getByText("Home"));
    }

    const driver = {
      ...app,
      addProductToCart,
      viewCart,
      checkout,
      home
    };

    try {
      await testFn(driver);
    } finally {
      close();
    }
  };

  return {
    productRepo,
    orderRepo,
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

