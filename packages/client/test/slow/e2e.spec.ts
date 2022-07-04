import Puppeteer, {Browser} from "puppeteer";
import axios from "axios";
import {aProduct} from "@ts-react-tdd/server/src/types";

//TODO hot module reload for quick feedback cycle
//TODO proper stack traces for unhandled promise rejections

let browser: Browser;
beforeAll(async () => {
    browser = await Puppeteer.launch();
}, 60 * 1000);


afterAll(() => {
    return browser.close();
});

test(
    "a customer is able to buy a product",
    async () => {
        await axios.post<void>(`http://localhost:8080/products/`, aProduct());
        const context = await browser.createIncognitoBrowserContext()

        const page = await context.newPage();
        await page.goto("http://localhost:3000");

        const addToCart = await page.waitForSelector("aria/Add to cart");
        expect(addToCart).not.toBeNull();
        await addToCart!.click();

        expect(await page.waitForSelector("aria/1 items in cart")).not.toBeNull();

        const viewCart = await page.$("aria/View cart");
        expect(viewCart).not.toBeNull();
        await viewCart!.click();

        const checkout = await page.waitForSelector("aria/Checkout");
        expect(checkout).not.toBeNull();
        await checkout!.click();

        expect(await page.waitForSelector("aria/Thank You")).not.toBeNull();

        //TODO assert confirmation email
    },
    60 * 1000
);


test(
    "cart is retained between renders", // this test is here because I couldn't make this test fail as a fast-integretive test
    async () => {
        await axios.post<void>(`http://localhost:8080/products/`, aProduct());
        const context = await browser.createIncognitoBrowserContext()

        const page = await context.newPage();
        await page.goto("http://localhost:3000");

        const addToCart = await page.waitForSelector("aria/Add to cart");
        expect(addToCart).not.toBeNull();
        await addToCart!.click();

        expect(await page.waitForSelector("aria/1 items in cart")).not.toBeNull();
        
        await page.reload();

        expect(await page.waitForSelector("aria/1 items in cart")).not.toBeNull();
    
    },
    60 * 1000
);
