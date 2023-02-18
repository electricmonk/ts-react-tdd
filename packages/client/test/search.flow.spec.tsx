import { aProduct } from "@ts-react-tdd/server/src/builders";
import { makeApp } from "../src/adapters/harness";
import userEvent from "@testing-library/user-event";

test("Product search is case-insensitive", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const minimoog = aProduct({title: "Minimoog"});
    const ob8x = aProduct({title: "OB 8x"});
    const { runInHarness } = await makeApp([moogOne, minimoog, ob8x]);

    await runInHarness(async (app) => {
      await userEvent.type(app.getByPlaceholderText('Search products'), 'moog');
      await userEvent.click(app.getByLabelText('Search'));

      expect(app.queryByText(moogOne.title)).toBeInTheDocument();
      expect(app.queryByText(minimoog.title)).toBeInTheDocument();
      expect(app.queryByText(ob8x.title)).not.toBeInTheDocument();
    });

})
