// Visual and interaction regression check for the teacher command center.
// Run against an already-running mock-mode Vite server.
const { chromium } = require('@playwright/test');
const path = require('path');
const os = require('os');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => localStorage.setItem('sf-locale', 'en'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`${BASE}/today`, { waitUntil: 'networkidle' });
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  await page.getByText(todayLabel, { exact: false }).first().waitFor();
  await page.getByRole('heading', { name: 'My performance' }).waitFor();
  await page.getByText('#4', { exact: true }).waitFor();
  await page.getByRole('heading', { name: 'Attendance trend' }).waitFor();
  await page.getByRole('heading', { name: 'Teaching load' }).waitFor();
  await page.getByRole('heading', { name: 'Group health' }).waitFor();

  const charts = await page.locator('main svg[role="img"]').count();
  if (charts < 2) throw new Error(`Expected rank and attendance charts; found ${charts}`);

  const task = page.getByRole('button', { name: 'Toggle status' }).first();
  await task.click();
  if ((await task.getAttribute('aria-pressed')) !== 'true') {
    throw new Error('Task status interaction did not survive the dashboard redesign');
  }

  await page.screenshot({ path: path.join(os.tmpdir(), 'starforge-dashboard-desktop.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'My performance' }).waitFor();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`Mobile dashboard overflows horizontally by ${overflow}px`);
  await page.screenshot({ path: path.join(os.tmpdir(), 'starforge-dashboard-mobile.png'), fullPage: true });

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write('PASS dashboard desktop/mobile layout, charts, and task interaction\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
