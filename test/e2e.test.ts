import Puppeteer, { Browser } from "puppeteer";

//TODO hot module reload for quick feedback cycle
//TODO proper stack traces for unhandled promise rejections

let browser: Browser;
beforeAll(async () => {
  browser = await Puppeteer.launch();
});

afterAll(() => {
  return browser.close();
});

test(
  "a customer is able to add a product to the shopping cart",
  async () => {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");

    const addToCart = await page.$("aria/Add to cart");
    expect(addToCart).not.toBeNull();

    await addToCart!.click();

    expect(await page.$("aria/1 item in cart")).not.toBeNull();
  },
  60 * 1000
);

