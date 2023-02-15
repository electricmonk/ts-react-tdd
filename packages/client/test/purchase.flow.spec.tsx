import { aProduct } from "@ts-react-tdd/server/src/builders";
import { makeApp } from "../src/adapters/harness";

test("a user can purchase a product, see the confirmation page and see their order summary, after which the cart is reset", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const { runInHarness, orderRepo } = await makeApp([moogOne]);

    await runInHarness(async (app) => {
      await app.findByText("0 items in cart");

      await app.addProductToCart(moogOne.title);
      await app.findByText("1 items in cart");
  
      await app.viewCart();
      expect(await app.findByText(moogOne.title)).toBeTruthy();

      await app.checkout();
      expect(await app.findByText("Thank You")).toBeTruthy();
      expect(await app.findByText(moogOne.title)).toBeTruthy();

      expect(orderRepo.orders).toContainEqual(expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
                name: moogOne.title,
            })
          ])
      }));

      await app.home();
      await app.findByText("0 items in cart");
  
    });

})
