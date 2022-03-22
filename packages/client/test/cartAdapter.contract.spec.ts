import {
  CartAdapter,
  HTTPCartAdapter,
} from "../src/adapters/cart";
import {InMemoryShopBackend} from "../src/adapters/inMemoryShopBackend";

const adapters: Array<[string, CartAdapter]> = [
  ["InMemory", new InMemoryShopBackend([])],
  ["HTTP", new HTTPCartAdapter("http://localhost:8080")],
];

describe.each(adapters)("The %s cart adapter", (_, cartAdapter) => {
  it("initializes the count with 0 and adds one item", async () => {
    const cartId = new Date().toString();

    expect(await cartAdapter.getCount(cartId)).toBe(0);
    await cartAdapter.addItem(cartId, "id");
    expect(await cartAdapter.getCount(cartId)).toBe(1);
  });
});
