import {aProduct} from "@ts-react-tdd/server/src/builders";
import {runServerAndRenderApp} from "../src/adapters/harness";
import userEvent from "@testing-library/user-event";
import {InMemoryProductRepository} from "@ts-react-tdd/server/src/adapters/fakes";

test("Product search is case-insensitive", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const minimoog = aProduct({title: "Minimoog"});
    const ob8x = aProduct({title: "OB 8x"});
    using harness = await runServerAndRenderApp({
        productRepo: new InMemoryProductRepository([moogOne, minimoog, ob8x]),
    });
    const {driver} = harness;

    await userEvent.type(driver.getByPlaceholderText('Search products'), 'moog');
    await userEvent.click(driver.getByLabelText('Search'));

    expect(driver.queryByText(moogOne.title)).toBeInTheDocument();
    expect(driver.queryByText(minimoog.title)).toBeInTheDocument();
    expect(driver.queryByText(ob8x.title)).not.toBeInTheDocument();

})
