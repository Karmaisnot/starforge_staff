// Regression check for the localized AI 503 lockout.
// Run against Vite started with VITE_USE_MOCK=false.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4175';
const cases = [
  ['en', 'AI actions are currently unavailable', 'All actions blocked'],
  ['ru', 'Действия AI сейчас недоступны', 'Все действия заблокированы'],
  ['uz', 'AI amallari hozirda mavjud emas', 'Barcha amallar bloklangan'],
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  try {
    for (const [locale, title, access] of cases) {
      const context = await browser.newContext();
      await context.addInitScript(
        ({ activeLocale }) => {
          localStorage.setItem('sf-session-access', 'e2e-session');
          localStorage.setItem('sf-locale', activeLocale);
        },
        { activeLocale: locale },
      );

      const page = await context.newPage();
      await page.route('**/api/v1/**', async (route) => {
        const requestUrl = route.request().url();
        if (requestUrl.includes('/users/me/')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                id: 7,
                full_name: 'Nigora Karimova',
                role_memberships: [{ role: 'teacher', account_type_name: 'Teacher' }],
              },
            }),
          });
          return;
        }
        if (requestUrl.includes('/ai/')) {
          await route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              code: 'service_unavailable',
              message: 'AI service unavailable',
            }),
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: [] }),
        });
      });

      await page.goto(`${BASE}/ai`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: title }).waitFor();
      await page.getByText('HTTP 503', { exact: true }).first().waitFor();
      await page.getByText(access, { exact: true }).waitFor();

      const actionable = await page
        .locator('main button, main input, main textarea, main select')
        .count();
      if (actionable !== 0) {
        throw new Error(
          `${locale}: expected a full lockout, found ${actionable} actionable controls`,
        );
      }

      await context.close();
      process.stdout.write(`PASS ${locale} localized 503 lockout\n`);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
