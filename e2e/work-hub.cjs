// Staff Work hub interaction and responsive-layout regression check.
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

  await page.goto(`${BASE}/work`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Work hub' }).waitFor();
  await page.getByRole('heading', { name: 'Your next commitment is ready.' }).waitFor();
  await page.getByRole('button', { name: 'New request' }).waitFor();
  await page.getByText('Seven-day view', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Next week' }).click();
  await page.getByRole('button', { name: 'Today', exact: true }).click();

  await page.getByRole('tab', { name: /Requests/ }).click();
  await page.getByRole('button', { name: 'New request' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: /Expense/ }).click();
  await dialog.getByLabel('Request title').fill('Replace damaged whiteboard');
  await dialog.getByLabel('Details').fill('Room 204 needs a replacement before Monday.');
  await dialog.getByLabel('Amount').fill('650000');
  await dialog.getByRole('button', { name: 'Submit request' }).click();
  const created = page.locator('article').filter({ hasText: 'Replace damaged whiteboard' });
  await created.waitFor();
  await created.getByRole('button', { name: 'Cancel request' }).click();
  await created.getByText('Cancelled', { exact: true }).waitFor();

  await page.getByRole('tab', { name: /Meetings & cover/ }).click();
  const firstMeeting = page.locator('article').filter({ hasText: 'Academic weekly' });
  await firstMeeting.getByRole('button', { name: 'Accept' }).click();
  await firstMeeting.getByText('Accepted', { exact: true }).waitFor();
  const firstCover = page.locator('article').filter({ hasText: 'Speaking club · B2' });
  await firstCover.getByRole('button', { name: 'Claim this lesson' }).click();
  await firstCover.getByText('Assigned', { exact: true }).waitFor();

  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-work-desktop.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Work hub' }).waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 1) throw new Error(`Mobile Work hub overflows horizontally by ${overflow}px`);
  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-work-mobile.png'),
    fullPage: true,
  });

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write(
    'PASS Work hub calendar, request lifecycle, RSVP, cover claim, and responsive layout\n',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
