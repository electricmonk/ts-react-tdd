import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { App } from "../src/components/App";

describe("The cart", () => {
  it("initialized as empty and then reflects an item being added", async () => {
    const app = render(<App />);
    app.getByText("0 items in cart");

    const add = app.getByText("Add");
    fireEvent.click(add);
    await app.findByText("1 items in cart");
  });
});
