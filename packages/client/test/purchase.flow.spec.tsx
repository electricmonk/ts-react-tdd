import {aProduct} from "@ts-react-tdd/server/src/builders";
import {makeApp} from "../src/adapters/harness";
import {InMemoryProductRepository} from "@ts-react-tdd/server/src/adapters/fakes";

test("a user can purchase a product, see the confirmation page and see their order summary, after which the cart is reset", async () => {

    const moogOne = aProduct({title: "Moog One"});
    using harness = await makeApp({
        productRepo: new InMemoryProductRepository([moogOne]),
    });
    const {driver, orderRepo} = harness;

    await driver.findByRole('paragraph', { name: /0 items in cart/i });

    await driver.addProductToCart(moogOne.title);
    await driver.findByRole('paragraph', { name: /1 items in cart/i });

    await driver.viewCart();
    expect(await driver.findByRole('listitem', { name: moogOne.title })).toBeTruthy();

    await driver.checkout();
    expect(await driver.findByRole('heading', { name: /thank you/i })).toBeTruthy();
    expect(await driver.findByRole('listitem', {name: moogOne.title})).toBeTruthy();

    expect(orderRepo.orders).toContainEqual(expect.objectContaining({
        items: expect.arrayContaining([
            expect.objectContaining({
                name: moogOne.title,
            })
        ])
    }));

    await driver.home();
    await driver.findByRole('paragraph', { name: /0 items in cart/i });
})
