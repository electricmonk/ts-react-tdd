import {render, within} from "@testing-library/react";
import {createTestingModule, runMicroservices} from "@ts-react-tdd/server/src/server.testkit";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import {App} from "../components/App";
import {MicroservicesIOProvider, MonolithIOProvider} from "./context";
import userEvent from "@testing-library/user-event";
import {ProductTemplate} from "@ts-react-tdd/server/src/types";

type AppContext = {
    products: ProductTemplate[]
};

function createDriver(app: ReturnType<typeof render>) {

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

    return {
        ...app,
        addProductToCart,
        viewCart,
        checkout,
        home
    };

}

export async function makeMonolithicApp({
                                  products = [],
                              }: AppContext) {

    const {nest, orderRepo, productRepo} = await createTestingModule(products);

    const queryClient = new QueryClient();

    const server = await nest.listen(0, "127.0.0.1");

    const app = render(<MemoryRouter><MonolithIOProvider backendUrl={await nest.getUrl()}> <QueryClientProvider client={queryClient}><App/></QueryClientProvider></MonolithIOProvider>
    </MemoryRouter>);

    const driver = createDriver(app);

    return {
        productRepo,
        orderRepo,
        driver,
        [Symbol.dispose]: () => server.close(),
    };
}

export async function runBackendAndRender({
                                  products = [],
                              }: AppContext) {

    const { catalogApp, ordersApp, cartApp, orderRepo } = await runMicroservices(products)

    const queryClient = new QueryClient();

    const catalogServer = await catalogApp.listen(0, "127.0.0.1");
    const ordersServer = await ordersApp.listen(0, "127.0.0.1");
    const cartServer = await cartApp.listen(0, "127.0.0.1");

    const app = render(<MemoryRouter>
        <MicroservicesIOProvider cartUrl={await cartApp.getUrl()} catalogUrl={await catalogApp.getUrl()} ordersUrl={await ordersApp.getUrl()}>
            <QueryClientProvider client={queryClient}><App/></QueryClientProvider>
        </MicroservicesIOProvider>
    </MemoryRouter>);

    const driver = createDriver(app);

    return {
        orderRepo,
        app: driver,
        [Symbol.dispose]: async () => {
            await cartServer.close();
            await catalogServer.close();
            await ordersServer.close();
        },
    };
}


