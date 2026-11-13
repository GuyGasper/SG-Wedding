import { test, expect, type Page, type Locator } from '@playwright/test';

async function expectNoOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

async function expectImageLoaded(image: Locator) {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
}

test('every main navigation link opens its page and closes the mobile menu', async ({ page, viewport }) => {
  await page.goto('/');
  const mobileLayout = (viewport?.width ?? 1280) < 768;
  const routes = [
    ['Details', '/details'],
    ['Travel and Accommodation', '/travel-and-accommodation'],
    ['Wedding Party', '/wedding-party'],
    ['FAQ', '/faq'],
    ['Home', '/'],
  ];
  for (const [name, path] of routes) {
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    if (mobileLayout) await nav.getByRole('button', { name: 'Open navigation menu' }).click();
    await nav.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole('main')).toHaveCount(1);
    if (mobileLayout) {
      await expect(nav.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false');
      await expect(nav.getByRole('link')).toHaveCount(0);
      await expect(page.locator('.mobile-current-page')).toHaveText(name);
      if (path !== '/') await expect(page.locator('.party-masthead')).toBeHidden();
    } else {
      await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page');
    }
    await expectNoOverflow(page);
  }
});

test('mobile travel title underlines the whole line when it fits and only the last line when wrapped', async ({ page }) => {
  await page.goto('/travel-and-accommodation');
  await page.evaluate(() => document.fonts.ready);
  const title = page.locator('.mobile-current-page');
  for (const width of [320, 600, 320, 600]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(title).toBeVisible();
    if (width === 320) {
      await expect(title).toHaveAttribute('data-wrapped', 'true');
      await expect(title).toHaveCSS('text-decoration-line', 'none');
      await expect(title.locator('span')).toHaveCSS('text-decoration-line', 'underline');
    } else {
      await expect(title).not.toHaveAttribute('data-wrapped');
      await expect(title).toHaveCSS('text-decoration-line', 'underline');
      await expect(title).toHaveCSS('height', '34px');
    }
    await expectNoOverflow(page);
  }
});

test('Details shows the wedding weekend, venue photo, and ceremony time', async ({ page }) => {
  await page.goto('/details');
  const main = page.getByRole('main', { name: 'Wedding weekend details' });
  await expect(main.getByRole('heading', { name: 'Welcome Party', exact: true })).toBeVisible();
  await expect(main.locator('time[datetime="2027-10-01"]')).toHaveText('Friday, October 1, 2027');
  await expect(main.locator('time[datetime="2027-10-02"]')).toHaveText('Saturday, October 2, 2027');
  const time = main.locator('time[datetime="2027-10-02T16:30"]');
  await expect(time).toHaveText('4:30 PM');
  await expect(main.locator('address')).toContainText('425 N Pine St');
  await expect(main.locator('address')).toContainText('Burlington, WI 53105');
  await expect(main).toContainText('Cocktail hour, dinner, and dancing to follow!');
  const image = main.getByRole('img', { name: /Wedding reception tables/ });
  await expectImageLoaded(image);
  const photoBox = await image.boundingBox();
  const timeBox = await time.boundingBox();
  expect(photoBox).not.toBeNull();
  expect(timeBox).not.toBeNull();
  expect(photoBox!.y + photoBox!.height).toBeLessThan(timeBox!.y);
  await expectNoOverflow(page);
});

test('FAQ exposes its landmark and renders map and email as actual links', async ({ page }) => {
  await page.goto('/faq');
  const main = page.getByRole('main', { name: 'FAQ', exact: true });
  await expect(main).toBeVisible();
  const parking = main.getByRole('region', { name: 'Is parking available at the venue?', exact: true });
  const map = parking.getByRole('link');
  await expect(map).toHaveAttribute('href', 'https://www.burlington-wi.gov/DocumentCenter/View/1692/Downtown-Parking-Map---2026');
  await expect(map).toHaveAttribute('target', '_blank');
  await expect(map).toHaveAttribute('rel', /noopener/);
  const contact = main.getByRole('region', { name: 'Who can I contact with questions?', exact: true });
  const email = contact.getByRole('link', { name: 'weddingsg2027@gmail.com', exact: true });
  await expect(email).toHaveAttribute('href', 'mailto:weddingsg2027@gmail.com');
  await expect(email).not.toHaveAttribute('target', '_blank');
  await expect(contact).not.toContainText('<a href=');
  await expectNoOverflow(page);
});

test('lodging selectors show only the chosen hotels with the correct badges and links', async ({ page }) => {
  await page.goto('/travel-and-accommodation');
  const selector = page.getByRole('group', { name: 'Where to stay', exact: true });
  const cases = [
    { area: 'Burlington', hotels: ['Baymont by Wyndham Burlington', 'AmericInn by Wyndham Burlington'], ids: ['d263310-', 'd239876-'], blocked: false },
    { area: 'Lake Geneva', hotels: ['Comfort Suites Lake Geneva East'], ids: ['d578283-'], blocked: true },
    { area: 'Elkhorn', hotels: ['Hampton Inn Elkhorn'], ids: ['d1237844-'], blocked: true },
    { area: 'Kenosha', hotels: ['Hampton Inn & Suites Kenosha'], ids: ['d8325460-'], blocked: true },
  ];
  for (const { area, hotels, ids, blocked } of cases) {
    await selector.getByRole('button', { name: area, exact: true }).click();
    await expect(selector.getByRole('button', { pressed: true })).toHaveCount(1);
    await expect(selector.getByRole('button', { name: area, exact: true })).toHaveAttribute('aria-pressed', 'true');
    const region = page.getByRole('region', { name: area, exact: true });
    await expect(page.locator('.travel-hub')).toHaveCount(1);
    await expect(region.getByRole('heading', { level: 3 })).toHaveText(hotels);
    for (let i = 0; i < hotels.length; i++) {
      const hotel = region.getByRole('article').filter({ has: page.getByRole('heading', { name: hotels[i], exact: true }) });
      const review = hotel.getByRole('link', { name: /^Guest review score/ });
      await expect(review).toHaveAttribute('href', new RegExp('^https://www\\.tripadvisor\\.com/Hotel_Review-.*' + ids[i]));
      await expect(hotel.getByLabel(/Estimated price level/)).toHaveText(/^\${1,4}$/);
      await expect(hotel.getByText('Room block available', { exact: true })).toHaveCount(blocked ? 1 : 0);
      const booking = hotel.getByRole('link', { name: blocked ? /View Booking Link/ : /View website/ });
      await expect(booking).toHaveAttribute('href', /^https:\/\//);
      await expect(booking).toHaveAttribute('rel', /noopener/);
      const drive = hotel.locator('.travel-hotel-time');
      await expect(drive).toContainText(/Drive to venue · \d+ min/);
      await expect(drive.locator('svg')).toHaveCount(1);
    }
    await expectNoOverflow(page);
  }
});

test('single hotels center below their region while pairs retain the responsive layout', async ({ page, viewport }) => {
  await page.goto('/travel-and-accommodation');
  const selector = page.getByRole('group', { name: 'Where to stay', exact: true });
  const hotels = page.locator('.travel-hotels article');
  await expect(hotels).toHaveCount(2);
  const first = await hotels.nth(0).boundingBox();
  const second = await hotels.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  if ((viewport?.width ?? 1280) < 768) {
    expect(second!.y).toBeGreaterThan(first!.y + first!.height);
  } else {
    expect(second!.x).toBeGreaterThan(first!.x + first!.width);
    expect(Math.abs(second!.y - first!.y)).toBeLessThan(1);
  }
  await selector.getByRole('button', { name: 'Lake Geneva', exact: true }).click();
  await expect(hotels).toHaveCount(1);
  const single = await hotels.first().boundingBox();
  const grid = await page.locator('.travel-hotels').boundingBox();
  expect(single).not.toBeNull();
  expect(grid).not.toBeNull();
  expect(Math.abs(single!.x + single!.width / 2 - (grid!.x + grid!.width / 2))).toBeLessThan(1);
  expect(Math.abs(single!.width - first!.width)).toBeLessThan(1);
  await page.setViewportSize({ width: 320, height: 740 });
  await expectNoOverflow(page);
});

test('lodging area links work on load and when only the URL fragment changes', async ({ page }) => {
  await page.goto('/travel-and-accommodation#stay-elkhorn');
  await expect(page.getByRole('heading', { name: 'Hampton Inn Elkhorn', exact: true })).toBeVisible();
  await page.goto('/travel-and-accommodation#stay-kenosha');
  await expect(page.getByRole('heading', { name: 'Hampton Inn & Suites Kenosha', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hampton Inn Elkhorn', exact: true })).toHaveCount(0);
  await page.goto('/travel-and-accommodation#stay-unknown');
  await expect(page.getByRole('heading', { name: 'Baymont by Wyndham Burlington', exact: true })).toBeVisible();
});

test('wedding party portraits load and retain square frames', async ({ page }) => {
  await page.goto('/wedding-party');
  const portraits = page.locator('.party-portrait');
  expect(await portraits.count()).toBeGreaterThan(0);
  for (const portrait of await portraits.all()) {
    await portrait.scrollIntoViewIfNeeded();
    await expectImageLoaded(portrait.locator('img'));
    const box = await portrait.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(1);
  }
  await expectNoOverflow(page);
});
