import {fireEvent, render, within} from "@testing-library/react";
import {App} from "../../src/components/App";
import {MemoryRouter} from "react-router-dom";
import {InMemoryShopBackend} from "../../src/adapters/inMemoryShopBackend";
import {aProduct} from "@ts-react-tdd/server/src/types";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

const Root = ({backend} : {backend: InMemoryShopBackend}) => <QueryClientProvider client={new QueryClient()}>
    <RecoilRoot>
        <MemoryRouter>
            <App cartAdapter={backend} catalog={backend} orderAdapter={backend}/>
        </MemoryRouter>
    </RecoilRoot>
</QueryClientProvider>;

class LocalStorageMock {
    constructor(private store: any = {}) {
      this.store = {};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key: string) {
      return this.store[key] || null;
    }
  
    setItem(key: string, value: string) {
      this.store[key] = String(value);
    }
  
    removeItem(key: string) {
      delete this.store[key];
    }

    get length() {
        return this.store.length;
    }

    key(index: number) {
        return Object.keys(this.store)[index];
    }
  }
  

beforeEach(() => global.localStorage = new LocalStorageMock())


test("a user can purchase a product, see the confirmation page and get a confirmation email", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const backend = new InMemoryShopBackend([moogOne]);

    const app = render(<Root backend={backend}/>);
    await app.findByText("0 items in cart");

    const product = await app.findByLabelText(moogOne.title)
    const add = within(product).getByText("Add");
    fireEvent.click(add);

    await app.findByText("1 items in cart");

    const viewCart = await app.findByText("View cart");
    fireEvent.click(viewCart);

    const checkout = await app.findByText("Checkout");
    fireEvent.click(checkout);

    expect(await app.findByText("Thank You")).toBeTruthy();
    expect(await app.findByText(moogOne.title)).toBeTruthy();

})
