import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Shop } from "../src/components/Shop";
import { InMemoryCartAdapter } from "../src/adapters/cart";

describe("The cart", () => {
  it("initialized as empty and then reflects an item being added", async () => {
    const cartAdapter = new InMemoryCartAdapter();
    const app = render(<Shop cartAdapter={cartAdapter} />);
    app.getByText("0 items in cart");

    const add = app.getByText("Add");
    fireEvent.click(add);
    await app.findByText("1 items in cart");
  });
});
