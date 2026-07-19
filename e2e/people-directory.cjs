// Role-aware people directory interaction and responsive-layout regression check.
// Run against an already-running mock-mode Vite server.
const { chromium } = require('@playwright/test');
const path = require('path');
const os = require('os');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  await context.addInitScript(() => localStorage.setItem('sf-locale', 'en'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`${BASE}/people`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'People directory' }).waitFor();
  await page.getByRole('heading', { name: /Know who is moving/ }).waitFor();
  await page.getByRole('heading', { name: 'Find the right person' }).waitFor();

  await page.getByRole('button', { name: /Timur Usmanov/ }).click();
  const profile = page.getByLabel('Person profile');
  await profile.getByRole('heading', { name: 'Timur Usmanov' }).waitFor();
  await profile.getByText('Technology', { exact: true }).waitFor();

  await page.getByRole('tab', { name: /Teachers/ }).click();
  await page.getByRole('button', { name: /Nigora Karimova Teacher/ }).waitFor();
  await page.getByRole('tab', { name: /Students/ }).click();
  await page.getByLabel('Search name, role, group or branch…').fill('Diyor');
  await page.getByRole('button', { name: /Karimov Diyor/ }).waitFor();
  if (await page.getByRole('button', { name: /Akbarov Akmal/ }).isVisible()) {
    throw new Error('People search still shows a non-matching student');
  }

  await page.getByLabel('Search name, role, group or branch…').fill('');
  await page.getByRole('tab', { name: /Staff/ }).click();
  await page.getByRole('button', { name: 'Away', exact: true }).click();
  await page.getByRole('button', { name: /Kamola Yuldasheva/ }).waitFor();
  await page.getByRole('button', { name: 'All', exact: true }).click();

  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-people-desktop.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'People directory' }).waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 1) throw new Error(`Mobile People directory overflows horizontally by ${overflow}px`);
  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-people-mobile.png'),
    fullPage: true,
  });

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write(
    'PASS People tabs, profile details, search, status filter, and responsive layout\n',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
