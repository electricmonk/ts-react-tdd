import {aProduct} from "@ts-react-tdd/server/src/builders";
import {makeApp} from "../src/adapters/harness";
import userEvent from "@testing-library/user-event";

test("Product search is case-insensitive", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const minimoog = aProduct({title: "Minimoog"});
    const ob8x = aProduct({title: "OB 8x"});
    using harness = await makeApp({
        products: [moogOne, minimoog, ob8x],
    });
    const {driver} = harness;

    await userEvent.type(driver.getByRole('textbox', {name: 'free-text-search'}), 'moog');
    await userEvent.click(driver.getByRole('button', { name: /search/i }));

    expect(driver.queryByRole('heading', { name: moogOne.title })).toBeInTheDocument();
    expect(driver.queryByRole('heading', { name: minimoog.title })).toBeInTheDocument();
    expect(driver.queryByRole('heading', { name: ob8x.title })).not.toBeInTheDocument();

})
