import {createTestingModule} from "../src/server.testkit";
import {aProduct} from "../src/builders";
import request from 'supertest';
import {test, expect} from 'vitest';

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

    const product = await productRepo.create(aProduct());
    const cartId = '666';

    await app
        .post(`/cart/${cartId}`)
        .send({productId: product.id})
        .expect(201);

    await app
        .get(`/cart/${cartId}`)
        .expect({id: cartId, items: [{
            productId: product.id,
            price: product.price,
            name: product.title
        }]});

    const orderId = await app
        .post(`/checkout/${666}`)
        .expect(201)
        .then(response => response.text);

    const order = await orderRepo.findById(orderId);
    expect(order).toMatchObject(expect.objectContaining({
        id: orderId,
        items: expect.arrayContaining([
            expect.objectContaining({
                productId: product.id,
            })
        ])
    }));
});