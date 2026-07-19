// Direct-URL authorization and management-account exclusion checks in mock mode.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });

  async function pageFor(role, route) {
    const context = await browser.newContext();
    await context.addInitScript(
      ({ activeRole }) => {
        localStorage.setItem('sf-locale', 'en');
        localStorage.setItem('sf-mock-role', activeRole);
      },
      { activeRole: role },
    );
    const page = await context.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    return { context, page };
  }

  let session = await pageFor('teacher', '/finance');
  await session.page
    .getByRole('heading', { name: 'This page is not part of your workspace.' })
    .waitFor();
  if (await session.page.getByRole('heading', { name: 'Finance desk' }).isVisible()) {
    throw new Error('Teacher direct URL loaded the cashier workspace');
  }
  await session.context.close();

  session = await pageFor('cashier', '/finance');
  await session.page.getByRole('heading', { name: 'Finance desk' }).waitFor();
  await session.context.close();

  session = await pageFor('cashier', '/ai');
  await session.page
    .getByRole('heading', { name: 'This page is not part of your workspace.' })
    .waitFor();
  await session.context.close();

  for (const role of ['director', 'head_of_dept']) {
    session = await pageFor(role, '/today');
    await session.page
      .getByRole('heading', { name: 'This app is for staff operations.' })
      .waitFor();
    await session.context.close();
  }

  await browser.close();
  process.stdout.write('PASS direct-route guards and management-account exclusion\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
