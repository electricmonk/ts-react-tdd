import {CartAdapter,} from "../src/adapters/cart";
import {InMemoryShopBackend} from "../src/adapters/inMemoryShopBackend";
import {nanoid} from "nanoid";
import {aProduct, ProductCatalog} from "../src/adapters/productCatalog";
import {OrderAdapter} from "../src/adapters/order";
import {HTTPShopBackend} from "../src/adapters/HTTPShopBackend";
import axios from "axios";
import {Product} from "@ts-react-tdd/server/types";

interface Harness {
  backend: OrderAdapter & ProductCatalog & CartAdapter,
  createProduct: (product: Product) => Promise<void>
}

const adapters: Array<[string, () => Harness]> = [
  ["InMemory", () => {
    const backend = new InMemoryShopBackend([]);
    return {backend, createProduct: backend.createProduct.bind(backend)}
  }],
  ["HTTP", () => {
    const url = "http://localhost:8080";
    return {
      backend: new HTTPShopBackend(url),
      createProduct: async (product) => {
        await axios.post<void>(`${url}/products/`, product);
      }
    }
  }],
];

describe.each(adapters)("The %s shop adapter", (_, backendFactory) => {

  it("creates an order from a cart", async () => {
    const {backend, createProduct } = backendFactory();
    const cartId = nanoid();
    const product = aProduct();
    await createProduct(product);
    await backend.addItem(cartId, product.id);
    expect(await backend.getCount(cartId)).toEqual(1)

    const orderId = await backend.checkout(cartId);
    const order = await backend.getOrder(orderId);

    expect(order).not.toBeNull();
    expect(order!.products).toHaveLength(1);
    expect(order!.products).toContainEqual(expect.objectContaining(product));
  })

  it("finds all products", async () => {
    const {backend, createProduct } = backendFactory();

    const product1 = aProduct();
    const product2 = aProduct();
    await createProduct(product1);
    await createProduct(product2);

    const products = await backend.findAllProducts();
    expect(products).toContainEqual(expect.objectContaining(product1))
    expect(products).toContainEqual(expect.objectContaining(product2))
  })
});
