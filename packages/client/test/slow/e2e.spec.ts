import { aProduct } from "@ts-react-tdd/server/src/types";
import axios from "axios";
import Puppeteer, { Browser } from "puppeteer";

const screenshotOnFailure = async (page: Puppeteer.Page) => {
    const ReportsDir = process.env.REPORTS_DIR || "./reports"
    await page.screenshot({path: `${ReportsDir}/e2e-failed.png`});
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

//TODO hot module reload for quick feedback cycle
//TODO proper stack traces for unhandled promise rejections

let browser: Browser;
beforeAll(async () => {
    browser = await Puppeteer.launch({slowMo: 10});
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
        try {
            await page.goto("http://localhost:3000");

            await sleep(100); // this is here to work around a bug where aria waitForSelector fails to find the element even though it's there

            const addToCart = await page.waitForSelector("aria/Add to cart");
            expect(addToCart).not.toBeNull();
            await addToCart!.click();

            await sleep(100); // this is here to work around a bug where aria waitForSelector fails to find the element even though it's there

            expect(await page.waitForSelector("aria/1 items in cart")).not.toBeNull();
    
            const viewCart = await page.$("aria/View cart");
            expect(viewCart).not.toBeNull();
            await viewCart!.click();
    
            const checkout = await page.waitForSelector("aria/Checkout");
            expect(checkout).not.toBeNull();
            await checkout!.click();
    
            expect(await page.waitForSelector("aria/Thank You")).not.toBeNull();
    
            //TODO assert confirmation email
        } catch (e) {
            await screenshotOnFailure(page);
            throw e;
        }

    },
    60 * 1000
);


test(
    "cart is retained between renders", // this test is here because I couldn't make this test fail as a fast-integretive test
    async () => {
        await axios.post<void>(`http://localhost:8080/products/`, aProduct());
        const context = await browser.createIncognitoBrowserContext()
        const page = await context.newPage();

        try {

            await page.goto("http://localhost:3000");

            await sleep(100); // this is here to work around a bug where aria waitForSelector fails to find the element even though it's there

            const addToCart = await page.waitForSelector("aria/Add to cart");
            expect(addToCart).not.toBeNull();
            await addToCart!.click();

            expect(await page.waitForSelector("aria/1 items in cart")).not.toBeNull();
            
            await page.reload();

            expect(await page.waitForSelector("aria/1 items in cart")).not.toBeNull();
        } catch (e) {
            await screenshotOnFailure(page);
            throw e;
        }
    },
    60 * 1000
);
