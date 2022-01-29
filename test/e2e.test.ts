import { test } from '@jest/globals';
import Puppeteer from 'puppeteer';

test('a customer is able to add a product to the shopping cart', async () => {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  const addToCart = await page.$('aria/Add to cart');
  expect(addToCart).not.toBeNull();

  await addToCart!.click();

  expect(await page.$('aria/1 item in cart')).not.toBeNull();

  await browser.close();
}, 60 * 1000);