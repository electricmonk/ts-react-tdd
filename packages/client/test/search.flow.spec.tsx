import {aProduct} from "@ts-react-tdd/server/src/builders";
import {runBackendAndRender} from "../src/adapters/harness";
import userEvent from "@testing-library/user-event";
import {test, expect} from 'vitest'

test("Product search is case-insensitive", async () => {

    const moogOne = aProduct({title: "Moog One"});
    const minimoog = aProduct({title: "Minimoog"});
    const ob8x = aProduct({title: "OB 8x"});
    using harness = await runBackendAndRender({
        products: [moogOne, minimoog, ob8x],
    });
    const {app} = harness;

    await userEvent.type(app.getByRole('textbox', {name: 'free-text-search'}), 'moog');
    await userEvent.click(app.getByRole('button', { name: /search/i }));

    expect(app.queryByRole('heading', { name: moogOne.title })).toBeInTheDocument();
    expect(app.queryByRole('heading', { name: minimoog.title })).toBeInTheDocument();
    expect(app.queryByRole('heading', { name: ob8x.title })).not.toBeInTheDocument();

})
