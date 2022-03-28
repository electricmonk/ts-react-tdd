import {CartAdapter,} from "../../src/adapters/cart";
import {InMemoryShopBackend} from "../../src/adapters/inMemoryShopBackend";
import {nanoid} from "nanoid";
import {ProductCatalog} from "../../src/adapters/productCatalog";
import {OrderAdapter} from "../../src/adapters/order";
import {HTTPShopBackend} from "../../src/adapters/HTTPShopBackend";
import axios from "axios";
import {aProduct, Product} from "@ts-react-tdd/server/src/types";

interface Harness {
  backend: OrderAdapter & ProductCatalog & CartAdapter,
  createProduct: (product: Omit<Product, "id">) => Promise<Product>
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
        const res = await axios.post<Product>(`${url}/products/`, product);
        return res.data;
      }
    }
  }],
];

describe.each(adapters)("The %s shop adapter", (_, backendFactory) => {

  it("creates an order from a cart", async () => {
    const {backend, createProduct } = backendFactory();
    const cartId = nanoid();
    const product = await createProduct(aProduct());
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

    const p1 = await createProduct(aProduct());
    const p2 = await createProduct(aProduct());

    const products = await backend.findAllProducts();
    expect(products).toContainEqual(expect.objectContaining(p1))
    expect(products).toContainEqual(expect.objectContaining(p2))
  })
});
