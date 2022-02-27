import {
  InMemoryCartAdapter,
  CartAdapter,
  HTTPCartAdapter,
} from "../src/adapters/cart";

const adapters: Array<[string, CartAdapter]> = [
  ["InMemory", new InMemoryCartAdapter()],
  ["HTTP", new HTTPCartAdapter("http://localhost:8080")],
];

describe.each(adapters)("The %s cart adapter", (_, cartAdapter) => {
  it("initializes the count with 0 and adds one item", async () => {
    expect(await cartAdapter.getCount()).toBe(0);
    await cartAdapter.addItem();
    expect(await cartAdapter.getCount()).toBe(1);
  });
});
