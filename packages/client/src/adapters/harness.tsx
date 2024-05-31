import {render, within} from "@testing-library/react";
import {InMemoryOrderRepository, InMemoryProductRepository} from "@ts-react-tdd/server/src/adapters/fakes";
import {createServerLogic} from "@ts-react-tdd/server/src/server";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import {App} from "../components/App";
import {IOContextProvider} from "./context";
import userEvent from "@testing-library/user-event";

type AppContext = {
    productRepo?: InMemoryProductRepository,
    orderRepo?: InMemoryOrderRepository
};

export async function makeApp({
                                  productRepo = new InMemoryProductRepository(),
                                  orderRepo = new InMemoryOrderRepository()
                              }: AppContext) {
    const fastify = createServerLogic(productRepo, orderRepo);
    const queryClient = new QueryClient();

    const baseUrl = await fastify.listen({host: '127.0.0.1', port: 0});

    const app = render(<MemoryRouter><IOContextProvider backendUrl={baseUrl}> <QueryClientProvider client={queryClient}><App/></QueryClientProvider></IOContextProvider>
    </MemoryRouter>);

    const addProductToCart = async (title: string) => {
        const product = await app.findByLabelText(title)
        const add = within(product).getByRole('button', { name: /add to cart/i });
        await userEvent.click(add);
    }

    const viewCart = async () => {
        await userEvent.click(await app.findByRole('button', { name: /view cart/i }));
    }

    const checkout = async () => {
        await userEvent.click(app.getByRole('button', { name: /checkout/i }));
    }

    const home = async () => {
        await userEvent.click(app.getByRole('button', { name: /home/i }));
    }

    const driver = {
        ...app,
        addProductToCart,
        viewCart,
        checkout,
        home
    };


    return {
        productRepo,
        orderRepo,
        driver,
        [Symbol.dispose]: () => fastify.close(),
    };
}


