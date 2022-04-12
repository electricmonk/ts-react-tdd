import { fireEvent, render, within } from "@testing-library/react";
import { App } from "../../src/components/App";
import { MemoryRouter } from "react-router-dom";
import { InMemoryShopBackend } from "../../src/adapters/inMemoryShopBackend";
import { aProduct } from "@ts-react-tdd/server/src/types";

test("a user can purchase a product, see the confirmation page and get a confirmation email", async () => {
  const moogOne = aProduct({ title: "Moog One" });
  const cartAdapter = new InMemoryShopBackend([moogOne]);

  const app = render(
    <MemoryRouter>
      <App cartAdapter={cartAdapter} catalog={cartAdapter} orderAdapter={cartAdapter} />
    </MemoryRouter>
  );
  app.getByText("0 items in cart");

  const product = await app.findByLabelText(moogOne.title);
  const add = within(product).getByText("Add");
  fireEvent.click(add);

  await app.findByText("1 items in cart");

  const viewCart = await app.findByText("View cart");
  fireEvent.click(viewCart);

  const checkout = await app.findByText("Checkout");
  fireEvent.click(checkout);

  expect(await app.findByText("Thank You")).toBeTruthy();
  expect(await app.findByText(moogOne.title)).toBeTruthy();
});

