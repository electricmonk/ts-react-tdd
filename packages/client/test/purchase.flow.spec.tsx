import {aProduct} from "@ts-react-tdd/server/src/builders";
import {runBackendAndRender} from "../src/adapters/harness";
import {expect, test} from 'vitest'

test("a user can purchase a product, see the confirmation page and see their order summary, after which the cart is reset", async () => {

    const moogOne = aProduct({title: "Moog One"});
    using harness = await runBackendAndRender({
        products: [moogOne],
    });
    const {app, orderRepo} = harness;

    await app.findByRole('paragraph', { name: /0 items in cart/i });

    await app.addProductToCart(moogOne.title);
    await app.findByRole('paragraph', { name: /1 items in cart/i });

    await app.viewCart();
    expect(await app.findByRole('listitem', { name: moogOne.title })).toBeTruthy();

    await app.checkout();
    expect(await app.findByRole('heading', { name: /thank you/i })).toBeTruthy();
    expect(await app.findByRole('listitem', {name: moogOne.title})).toBeTruthy();

    expect(orderRepo.orders).toContainEqual(expect.objectContaining({
        items: expect.arrayContaining([
            expect.objectContaining({
                name: moogOne.title,
            })
        ])
    }));

    await app.home();
    await app.findByRole('paragraph', { name: /0 items in cart/i });
})