import { test, expect } from '@playwright/test';
test('homepage content, navigation, and layout', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Sarah Eisenman & Guy Gasper/);
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('Sarah Eisenman & Guy Gasper');
  await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(1);
  await expect(page.getByRole('link', {name:'Home',exact:true})).toHaveAttribute('aria-current','page');
  await expect(page.locator('time')).toHaveText('October 2, 2027');
  await expect(page.locator('.hero img')).toBeVisible();
  expect(await page.locator('.hero img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({path: `.local/home-${test.info().project.name}.png`, fullPage:true});
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name:'Skip to content'})).toBeFocused();
});
test('same-origin API is reachable through /api', async ({ request }) => {
  const response = await request.get('/api/status');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({service:'SG Wedding API',status:'UP'});
});
