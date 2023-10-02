import {aProduct} from "@ts-react-tdd/server/src/builders";
import {runServerAndRenderApp} from "../src/adapters/harness";
import {InMemoryProductRepository} from "@ts-react-tdd/server/src/adapters/fakes";

test("a user can purchase a product, see the confirmation page and see their order summary, after which the cart is reset", async () => {

    const moogOne = aProduct({title: "Moog One"});
    using harness = await runServerAndRenderApp({
        productRepo: new InMemoryProductRepository([moogOne]),
    });
    const {driver, orderRepo} = harness;

    await driver.findByText("0 items in cart");

    await driver.addProductToCart(moogOne.title);
    await driver.findByText("1 items in cart");

    await driver.viewCart();
    expect(await driver.findByText(moogOne.title)).toBeTruthy();

    await driver.checkout();
    expect(await driver.findByText("Thank You")).toBeTruthy();
    expect(await driver.findByText(moogOne.title)).toBeTruthy();

    expect(orderRepo.orders).toContainEqual(expect.objectContaining({
        items: expect.arrayContaining([
            expect.objectContaining({
                name: moogOne.title,
            })
        ])
    }));

    await driver.home();
    await driver.findByText("0 items in cart");


})
