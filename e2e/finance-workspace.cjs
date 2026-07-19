// Finance workspace interaction and responsive-layout regression check.
// Run against an already-running mock-mode Vite server.
const { chromium } = require('@playwright/test');
const path = require('path');
const os = require('os');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  await context.addInitScript(() => {
    localStorage.setItem('sf-locale', 'en');
    localStorage.setItem('sf-mock-role', 'cashier');
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`${BASE}/finance`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Finance desk' }).waitFor();
  await page.getByText('Live branch ledger', { exact: true }).waitFor();
  await page.getByRole('heading', { name: 'Invoices' }).waitFor();

  await page.getByRole('button', { name: 'Overdue', exact: true }).click();
  await page.getByText('INV-1046', { exact: true }).waitFor();
  const nonOverdueInvoice = page
    .locator('article')
    .filter({ hasText: 'INV-1048' })
    .filter({ hasText: 'Akbarov Akmal' });
  if (await nonOverdueInvoice.isVisible()) {
    throw new Error('Overdue filter still shows a non-overdue invoice');
  }
  await page.getByRole('button', { name: 'All', exact: true }).click();

  await page.getByRole('button', { name: 'Collect payment' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Invoice').selectOption('inv-1048');
  await dialog.getByLabel('Amount').fill('500000');
  await dialog.getByRole('button', { name: 'Confirm cash payment' }).click();
  await page.getByText('Cash payment recorded', { exact: true }).waitFor();
  const invoice = page.locator('article').filter({ hasText: 'INV-1048' });
  await invoice.getByText('Paid', { exact: true }).waitFor();

  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-finance-desktop.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Finance desk' }).waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 1) throw new Error(`Mobile Finance desk overflows horizontally by ${overflow}px`);
  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-finance-mobile.png'),
    fullPage: true,
  });

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write(
    'PASS Finance filters, cash collection, invoice settlement, and responsive layout\n',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
