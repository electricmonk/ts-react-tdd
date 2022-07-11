import { aProduct, Product } from "@ts-react-tdd/server/src/types";
import axios from "axios";
import { nanoid } from "nanoid";
import { CartAdapter } from "../../src/adapters/cart";
import { HTTPShopBackend } from "../../src/adapters/HTTPShopBackend";
import { inMemoryServerLogic, unwireHttpCalls } from "../../src/adapters/InMemoryServerLogic";
import { InMemoryShopBackend } from "../../src/adapters/inMemoryShopBackend";
import { OrderAdapter } from "../../src/adapters/order";
import { ProductCatalog } from "../../src/adapters/productCatalog";

interface Harness {
  backend: OrderAdapter & ProductCatalog & CartAdapter,
  createProduct: (product: Omit<Product, "id">) => Promise<Product>
}

const adapters: Array<[string, () => Harness]> = [
  ["InMemoryServerLogic", inMemoryServerLogic],
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

afterEach(() => {
  unwireHttpCalls();
})

describe.each(adapters)("The %s shop adapter", (_, backendFactory) => {

  it("returns cart summary", async () => {
    const {backend, createProduct } = await backendFactory();

    const cartId = nanoid();
    const product = await createProduct(aProduct());
    await backend.addItem(cartId, product.id);

    const cartSummary = await backend.getCartSummary(cartId);
    expect(cartSummary).not.toBeNull();
    expect(cartSummary!.items).toHaveLength(1);
    expect(cartSummary!.items).toContainEqual(expect.objectContaining({
      productId: product.id,
      name: product.title,
      price: product.price
    }));

  });

  it("creates an order from a cart", async () => {
    const {backend, createProduct } = await backendFactory();
    const cartId = nanoid();
    const product = await createProduct(aProduct());
    await backend.addItem(cartId, product.id);
    expect(await backend.getCount(cartId)).toEqual(1)

    const orderId = await backend.checkout(cartId);
    const order = await backend.getOrder(orderId);

    expect(order).not.toBeNull();
    expect(order!.items).toHaveLength(1);
    expect(order!.items).toContainEqual(expect.objectContaining({
      productId: product.id,
      name: product.title,
      price: product.price
    }));

  })

  it("finds all products", async () => {
    const {backend, createProduct } = await backendFactory();

    const p1 = await createProduct(aProduct());
    const p2 = await createProduct(aProduct());

    const products = await backend.findAllProducts();
    expect(products).toContainEqual(expect.objectContaining(p1))
    expect(products).toContainEqual(expect.objectContaining(p2))

  })

});
