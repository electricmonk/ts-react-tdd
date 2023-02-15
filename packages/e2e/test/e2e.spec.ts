import { test, expect } from '@playwright/test';
import {aProduct} from "@ts-react-tdd/server/src/builders";

test('a customer is able to buy a product', async ({ page, request }) => {
  await request.post(`http://localhost:8080/products/`, { data: aProduct() });

  await page.goto('http://localhost:3000');
  const addToCart = await page.getByLabel('Add to cart');
  await addToCart.first().click();

  await (await page.getByLabel('View cart')).click();
  await (await page.getByLabel('Checkout')).click();

  await expect (await page.getByText('Thank you')).toBeVisible();
});