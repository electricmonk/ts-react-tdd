import { fireEvent, within } from "@testing-library/react";
import { aProduct } from "@ts-react-tdd/server/src/builders";
import { makeApp } from "../../src/adapters/harness";


test("a user can purchase a product, see the confirmation page and see their order summary, after which the cart is reset", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const { runInHarness } = await makeApp([moogOne]);

    await runInHarness(async (app) => {
      await app.findByText("0 items in cart");

      const product = await app.findByLabelText(moogOne.title)
      const add = within(product).getByText("Add");
      fireEvent.click(add);
  
      await app.findByText("1 items in cart");
  
      const viewCart = await app.findByText("View cart");
      fireEvent.click(viewCart);
  
      expect(await app.findByText(moogOne.title)).toBeTruthy();
      const checkout = app.getByText("Checkout");
      fireEvent.click(checkout);
  
      expect(await app.findByText("Thank You")).toBeTruthy();
      expect(await app.findByText(moogOne.title)).toBeTruthy();
  
      fireEvent.click(app.getByText("Home"));
  
      await app.findByText("0 items in cart");
  
    });

})
