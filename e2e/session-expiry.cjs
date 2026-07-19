// Every backend 401 must terminate the local session, regardless of error-code spelling.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4175';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem('sf-session-access', 'expired-e2e-session');
    localStorage.setItem('sf-locale', 'en');
  });
  const page = await context.newPage();
  await page.route('**/api/v1/**', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        code: 'session_revoked',
        message: 'This device session was revoked',
      }),
    }),
  );

  await page.goto(`${BASE}/today`, { waitUntil: 'networkidle' });
  await page.waitForURL('**/login');
  const token = await page.evaluate(() => localStorage.getItem('sf-session-access'));
  if (token !== null) throw new Error('401 did not clear the persisted access token');
  await page.getByRole('heading', { name: 'Sign in to StarForge' }).waitFor();

  await browser.close();
  process.stdout.write('PASS arbitrary 401 codes clear the session and redirect to login\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
