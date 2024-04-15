import {render, within} from "@testing-library/react";
import {createTestingModule} from "@ts-react-tdd/server/src/server";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import {App} from "../components/App";
import {IOContextProvider} from "./context";
import userEvent from "@testing-library/user-event";
import {ProductTemplate} from "@ts-react-tdd/server/src/types";

type AppContext = {
    products: ProductTemplate[]
};

export async function makeApp({
                                  products = [],
                              }: AppContext) {

    const {nest, orderRepo, productRepo} = await createTestingModule(products);

    const queryClient = new QueryClient();

    const server = await nest.listen(0, "127.0.0.1");

    const app = render(<MemoryRouter><IOContextProvider backendUrl={await nest.getUrl()}> <QueryClientProvider client={queryClient}><App/></QueryClientProvider></IOContextProvider>
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
        [Symbol.dispose]: () => server.close(),
    };
}


