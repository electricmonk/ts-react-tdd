import { fireEvent, render, within } from "@testing-library/react";
import { aProduct } from "@ts-react-tdd/server/src/types";
import { MemoryRouter } from "react-router-dom";
import { IOContext } from "../../src/adapters/context";
import { inMemoryBackend } from "../../src/adapters/inMemoryShopBackend";
import { App } from "../../src/components/App";
 


test("a user can purchase a product, see the confirmation page and get a confirmation email", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const backend = inMemoryBackend([moogOne]);

    const app = render(<MemoryRouter><IOContext.Provider value={backend}><App/></IOContext.Provider></MemoryRouter>);
    app.getByText("0 items in cart");

    const product = await app.findByLabelText(moogOne.title)
    const add = within(product).getByText("Add");
    fireEvent.click(add);

    await app.findByText("1 items in cart");

    const viewCart = await app.findByText("View cart");
    fireEvent.click(viewCart);

    expect(await app.findByText(moogOne.title)).toBeTruthy();
    const checkout = await app.getByText("Checkout");
    fireEvent.click(checkout);

    expect(await app.findByText("Thank You")).toBeTruthy();
    expect(await app.findByText(moogOne.title)).toBeTruthy();

})