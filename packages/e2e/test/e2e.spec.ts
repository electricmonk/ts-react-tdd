import { test, expect } from '@playwright/test';
import {aProduct} from "@ts-react-tdd/server/src/builders";

import {CATALOG_PORT} from "@ts-react-tdd/server/src/ports";

test('a customer is able to buy a product', async ({ page, request }) => {
  await request.post(`http://127.0.0.1:${CATALOG_PORT}/products`, { data: aProduct() });

  await page.goto('/');
  const addToCart = await page.getByLabel('Add to cart');
  await addToCart.first().click();

  await (await page.getByLabel('View cart')).click();
  await (await page.getByLabel('Checkout')).click();

  await expect (await page.getByText('Thank you')).toBeVisible();
});