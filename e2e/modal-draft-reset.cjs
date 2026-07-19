// Cancelled modal drafts must never leak into a later action.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  await context.addInitScript(() => localStorage.setItem('sf-locale', 'en'));
  const page = await context.newPage();

  await page.goto(`${BASE}/tasks`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'New task' }).first().click();
  let dialog = page.getByRole('dialog');
  await dialog.getByLabel('Task').fill('Draft that must disappear');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'New task' }).first().click();
  dialog = page.getByRole('dialog');
  await page.waitForTimeout(50);
  if (await dialog.getByLabel('Task').inputValue()) throw new Error('Task draft survived cancel');
  await page.keyboard.press('Escape');

  await page.goto(`${BASE}/work`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'New request' }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.getByLabel('Request title').fill('Stale request');
  await dialog.getByLabel('Details').fill('Stale details');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'New request' }).first().click();
  dialog = page.getByRole('dialog');
  await page.waitForTimeout(50);
  if (await dialog.getByLabel('Request title').inputValue()) {
    throw new Error('Work request draft survived cancel');
  }
  await page.keyboard.press('Escape');

  await page.goto(`${BASE}/surveys`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Start' }).first().click();
  dialog = page.getByRole('dialog');
  await dialog.locator('textarea').fill('Stale survey comment');
  await dialog.getByRole('button', { name: '1', exact: true }).click();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Start' }).first().click();
  dialog = page.getByRole('dialog');
  await page.waitForTimeout(50);
  if (await dialog.locator('textarea').inputValue()) throw new Error('Survey comment survived cancel');
  if ((await dialog.getByRole('button', { name: '4', exact: true }).getAttribute('aria-pressed')) !== 'true') {
    throw new Error('Survey rating survived cancel');
  }
  await page.keyboard.press('Escape');

  await context.close();
  const financeContext = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  await financeContext.addInitScript(() => {
    localStorage.setItem('sf-locale', 'en');
    localStorage.setItem('sf-mock-role', 'cashier');
  });
  const finance = await financeContext.newPage();
  await finance.goto(`${BASE}/finance`, { waitUntil: 'networkidle' });
  await finance.getByRole('button', { name: 'Collect payment' }).click();
  dialog = finance.getByRole('dialog');
  await dialog.getByLabel('Invoice').selectOption({ index: 1 });
  await dialog.getByLabel('Amount received').fill('100000');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await finance.getByRole('button', { name: 'Collect payment' }).click();
  dialog = finance.getByRole('dialog');
  await finance.waitForTimeout(50);
  if (await dialog.getByLabel('Invoice').inputValue()) throw new Error('Finance invoice survived cancel');
  if (await dialog.getByLabel('Amount received').inputValue()) {
    throw new Error('Finance amount survived cancel');
  }

  await browser.close();
  process.stdout.write('PASS cancelled modal drafts reset across tasks, work, surveys, and finance\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
