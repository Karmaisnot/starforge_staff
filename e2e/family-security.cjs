const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4180';

(async () => {
  const browser = await chromium.launch({ headless: true });

  async function session(role, route, width = 1100) {
    const context = await browser.newContext({ viewport: { width, height: 820 } });
    await context.addInitScript(({ activeRole }) => {
      localStorage.setItem('sf-locale', 'en');
      localStorage.setItem('sf-mock-role', activeRole);
    }, { activeRole: role });
    const page = await context.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    return { context, page };
  }

  let current = await session('registrar', '/people');
  await current.page.getByRole('tab', { name: /Parents/ }).click();
  await current.page.getByText('Dilnoza Akbarova', { exact: true }).first().waitFor();
  await current.page.getByText('Family profile', { exact: true }).waitFor();
  await current.context.close();

  current = await session('security', '/cards', 320);
  await current.page.getByRole('heading', { name: 'Card check-in' }).waitFor();
  await current.page.getByLabel('Card code').fill('demo-valid-card');
  await current.page.getByRole('button', { name: 'Check in' }).click();
  await current.page.getByText('Access granted', { exact: true }).waitFor();
  const overflow = await current.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`Security scanner overflows 320px by ${overflow}px`);
  await current.context.close();

  await browser.close();
  process.stdout.write('PASS registrar family directory and security card scanner at 320px\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
