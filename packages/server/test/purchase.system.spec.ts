import {createTestingModule} from "../src/server.testkit";
import {aProduct} from "../src/builders";
import request from 'supertest';

async function createTestHarness() {
    const {nest, ...rest} = await createTestingModule();
    return {
        app: request(nest.getHttpServer()),
        ...rest
    }
}

// this test is not really required, it's wholly contained within purchase.flow.spec.tsx
test('a user can order a product', async () => {
    const {app, productRepo, orderRepo} = await createTestHarness();

    const moogOne = await productRepo.create(aProduct({title: "Moog One"}));
    const cartId = '666';

    await app
        .post(`/cart/${cartId}`)
        .send({productId: moogOne.id})
        .expect(201);

    await app
        .get(`/cart/${cartId}`)
        .expect({id: cartId, items: [{
            productId: moogOne.id,
            price: moogOne.price,
            name: moogOne.title
        }]});

    const orderId = await app
        .post(`/checkout/${666}`)
        .expect(201)
        .then(response => response.text);

    expect(orderRepo.orders).toContainEqual(expect.objectContaining({
        id: orderId,
        items: expect.arrayContaining([
            expect.objectContaining({
                productId: moogOne.id,
            })
        ])
    }));
});