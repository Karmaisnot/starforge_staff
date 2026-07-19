const { chromium } = require('@playwright/test');
const path = require('path');
const os = require('os');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4180';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    localStorage.setItem('sf-locale', 'en');
    localStorage.setItem('sf-mock-role', 'teacher');
  });
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  await page.goto(`${BASE}/academic`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Academic center' }).waitFor();
  await page.getByRole('heading', { name: 'Teaching schedule' }).waitFor();
  await page.getByRole('tab', { name: 'Coursework' }).click();
  await page.getByRole('heading', { name: 'Assignments' }).waitFor();
  await page.getByRole('button', { name: 'Publish' }).first().click();
  await page.getByText('Assignment published', { exact: true }).waitFor();
  await page.getByRole('tab', { name: 'Student insights' }).click();
  await page.getByRole('heading', { name: 'Students needing attention' }).waitFor();
  await page.getByRole('tab', { name: 'Reports & placement' }).click();
  await page.getByRole('heading', { name: 'Report library' }).waitFor();
  await page.getByRole('button', { name: 'Generate' }).first().click();
  await page.getByText('Report generation started', { exact: true }).waitFor();
  await page.screenshot({ path: path.join(os.tmpdir(), 'starforge-academic-hub.png'), fullPage: true });

  await page.goto(`${BASE}/operations`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Staff operations' }).waitFor();
  await page.getByRole('button', { name: 'Acknowledge' }).click();
  await page.getByText('Rule acknowledged', { exact: true }).waitFor();
  await page.getByRole('tab', { name: 'Commerce & outreach' }).click();
  await page.getByRole('heading', { name: 'Purchase orders' }).waitFor();
  await page.getByRole('heading', { name: 'Campaign delivery' }).waitFor();
  await page.getByRole('tab', { name: 'Governance' }).click();
  await page.getByRole('heading', { name: 'Audit trail' }).waitFor();
  await page.getByRole('heading', { name: 'Access model' }).waitFor();

  for (const route of ['/academic', '/operations']) {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    const tabs = page.getByRole('tab');
    for (let index = 0; index < (await tabs.count()); index += 1) {
      await tabs.nth(index).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) throw new Error(`${route} tab ${index} overflows 320px by ${overflow}px`);
    }
  }

  const denied = await browser.newContext({ viewport: { width: 900, height: 700 } });
  await denied.addInitScript(() => {
    localStorage.setItem('sf-locale', 'en');
    localStorage.setItem('sf-mock-role', 'cashier');
  });
  const deniedPage = await denied.newPage();
  await deniedPage.goto(`${BASE}/academic`, { waitUntil: 'networkidle' });
  await deniedPage.getByRole('heading', { name: 'This page is not part of your workspace.' }).waitFor();
  await denied.close();

  if (browserErrors.length) {
    throw new Error(`Browser errors: ${[...new Set(browserErrors)].join(' | ')}`);
  }
  await context.close();
  await browser.close();
  process.stdout.write('PASS academic/operations API hubs, actions, role guard, and 320px layouts\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
