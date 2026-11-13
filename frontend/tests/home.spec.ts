import { test, expect } from '@playwright/test';
test('homepage content, navigation, and layout', async ({ page, viewport }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Sarah Eisenman & Guy Gasper/);
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('Sarah Eisenman & Guy Gasper');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name:'Skip to content'})).toBeFocused();
  await page.keyboard.press('Tab');
  const mobileLayout = (viewport?.width ?? 1280) < 768;
  const menuToggle = page.getByRole('button', {name:'Open navigation menu'});
  if (mobileLayout) {
    await expect(page.locator('.mobile-current-page')).toHaveText('Home');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(0);
    await menuToggle.click();
    await expect(page.getByRole('button', {name:'Close navigation menu'})).toHaveAttribute('aria-expanded', 'true');
  } else {
    await expect(menuToggle).toBeHidden();
  }
  await expect(page.getByRole('navigation').getByRole('link')).toHaveText(['Home', 'Details', 'Travel and Accommodation', 'Wedding Party', 'FAQ']);
  await expect(page.getByRole('link', {name:'Home',exact:true})).toHaveAttribute('aria-current','page');
  await expect(page.locator('time')).toHaveText('October 2, 2027');
  await expect(page.locator('.hero img')).toBeVisible();
  expect(await page.locator('.hero img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  if (mobileLayout) {
    await page.keyboard.press('Escape');
    await expect(menuToggle).toBeFocused();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('navigation').getByRole('link')).toHaveCount(0);
  }
  await page.screenshot({path: test.info().outputPath('home.png'), fullPage:true});
});
test('same-origin API is reachable through /api', async ({ request }) => {
  const response = await request.get('/api/status');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({service:'SG Wedding API',status:'UP'});
});

test('navigation opens the wedding party page with the current page selected', async ({ page, viewport }) => {
  await page.goto('/');
  const mobileLayout = (viewport?.width ?? 1280) < 768;
  if (mobileLayout) await page.getByRole('button', {name:'Open navigation menu'}).click();
  await page.getByRole('navigation').getByRole('link', {name:'Wedding Party', exact:true}).click();
  await expect(page).toHaveURL('/wedding-party');
  await expect(page.getByRole('heading', {name:'Katie Eisenman', exact:true})).toBeVisible();
  if (mobileLayout) {
    await expect(page.locator('.mobile-current-page')).toHaveText('Wedding Party');
    await expect(page.locator('.party-masthead')).toBeHidden();
    await expect(page.getByRole('button', {name:'Open navigation menu'})).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('button', {name:'Open navigation menu'}).click();
  } else {
    await expect(page.locator('.party-masthead')).toBeVisible();
  }
  await expect(page.getByRole('navigation').getByRole('link', {name:'Wedding Party', exact:true})).toHaveAttribute('aria-current', 'page');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
