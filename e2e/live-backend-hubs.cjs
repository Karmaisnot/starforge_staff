const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4181';
const USERNAME = process.env.E2E_USERNAME;
const PASSWORD = process.env.E2E_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.error('E2E_USERNAME and E2E_PASSWORD are required');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 } });
  await context.addInitScript(() => localStorage.setItem('sf-locale', 'en'));
  const page = await context.newPage();
  const serverFailures = [];
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    const url = response.url();
    const belongsToNewHub = [
      '/schedule/', '/attendance/', '/assignments/', '/academics/', '/intelligence/',
      '/achievements/', '/reports/', '/placement/', '/rewards/', '/rulebook/',
      '/procurement/', '/sales/', '/campaigns/', '/audit/', '/access/',
      '/parents/',
    ].some((prefix) => url.includes(`/api/v1${prefix}`));
    if (belongsToNewHub && response.status() >= 500) {
      serverFailures.push(`${response.status()} ${response.request().method()} ${response.url()}`);
    }
  });

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Username').fill(USERNAME);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(/\/today$/, { timeout: 20000 });

  await page.goto(`${BASE}/academic`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Academic center' }).waitFor({ timeout: 20000 });
  for (const tab of ['Overview', 'Coursework', 'Student insights', 'Reports & placement']) {
    await page.getByRole('tab', { name: tab }).click();
  }

  await page.goto(`${BASE}/operations`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Staff operations' }).waitFor({ timeout: 20000 });
  for (const tab of ['Staff & policy', 'Commerce & outreach', 'Governance']) {
    await page.getByRole('tab', { name: tab }).click();
  }

  await page.goto(`${BASE}/people`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'People directory' }).waitFor({ timeout: 20000 });

  if (serverFailures.length) throw new Error(`Live API 5xx: ${serverFailures.join(' | ')}`);
  if (pageErrors.length) throw new Error(`Browser errors: ${[...new Set(pageErrors)].join(' | ')}`);

  await context.close();
  await browser.close();
  process.stdout.write('PASS live teacher login and read-only academic/operations API hubs\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
