import {runMicroservices} from "../src/server.testkit";
import {aProduct} from "../src/builders";
import request from 'supertest';
import {test, expect} from 'vitest';
import {Order, Product, ProductTemplate} from "../src/types";

async function createTestHarness(products: ProductTemplate[]) {

    const {ordersApp, cartApp, catalogApp, ...rest} = await runMicroservices(products);
    return {
        catalogApp: request(catalogApp.getHttpServer()),
        ordersApp: request(ordersApp.getHttpServer()),
        cartApp: request(cartApp.getHttpServer()),
        ...rest
    }
}

test('a user can order a product from the microservices-based system', async () => {
    const {ordersApp, cartApp, catalogApp } = await createTestHarness([aProduct()]);

    const cartId = '666';

    const products = await catalogApp.get('/products/')
        .expect(200)
        .then((response) => {
            const items: unknown[] = response.body;
            return items.map(item => Product.parse(item));
        });

    expect(products).toHaveLength(1);
    const product = products[0];

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