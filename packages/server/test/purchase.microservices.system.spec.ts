import {runMicroservices} from "../src/server.testkit";
import {aProduct} from "../src/builders";
import request from 'supertest';
import {test, expect} from 'vitest';
import {Order} from "../src/types";

async function createTestHarness() {

    const {ordersApp, cartApp, ...rest} = await runMicroservices();
    return {
        ordersApp: request(ordersApp.getHttpServer()),
        cartApp: request(cartApp.getHttpServer()),
        ...rest
    }
}

// this test is not really required, it's wholly contained within purchase.flow.spec.tsx
test('a user can order a product from the microservices-based system', async () => {
    const {ordersApp, cartApp, productRepo } = await createTestHarness();

    const product = await productRepo.create(aProduct());
    const cartId = '666';

    await cartApp
        .post(`/cart/${cartId}`)
        .send({productId: product.id})
        .expect(201);

    await cartApp
        .get(`/cart/${cartId}`)
        .expect({id: cartId, items: [{
            productId: product.id,
            price: product.price,
            name: product.title
        }]});

    const orderId = await cartApp
        .post(`/cart/${cartId}/checkout`)
        .expect(201)
        .then(response => response.text);

    const order = await ordersApp
        .get(`/order/${orderId}`)
        .expect(200)
        .then(response => Order.parse(response.body));

    expect(order).toMatchObject(expect.objectContaining({
        id: orderId,
        items: expect.arrayContaining([
            expect.objectContaining({
                productId: product.id,
            })
        ])
    }));
});