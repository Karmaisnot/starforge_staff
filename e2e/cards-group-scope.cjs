// Card issuance must originate from a group and stay limited to that group's roster.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  await context.addInitScript(() => localStorage.setItem('sf-locale', 'en'));
  const page = await context.newPage();

  await page.goto(`${BASE}/cards`, { waitUntil: 'networkidle' });
  if (await page.getByRole('button', { name: 'Give card' }).count()) {
    throw new Error('Cards overview exposes a standalone Give card action');
  }

  await page.goto(`${BASE}/cohorts`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Give card' }).click();
  await page.waitForURL('**/cards');
  const dialog = page.getByRole('dialog');
  const student = dialog.getByLabel('Student');
  await student.waitFor();
  if ((await student.evaluate((node) => node.tagName)) !== 'SELECT') {
    throw new Error('Group card flow still accepts an unrestricted free-text student');
  }
  await student.selectOption({ label: 'Akbarov Akmal' });
  await dialog.getByLabel('Reason').fill('Excellent class contribution');
  await dialog.getByRole('button', { name: 'Give', exact: true }).click();
  await page.getByText('Akbarov Akmal', { exact: true }).first().waitFor();

  await browser.close();
  process.stdout.write('PASS card issuance is group-originated and roster-scoped\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
