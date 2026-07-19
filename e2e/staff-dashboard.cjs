// Staff dashboards must not leak teacher-only analytics or navigation.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
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

  await page.goto(`${BASE}/today`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'My work overview' }).waitFor();

  for (const metric of ['Open tasks', 'Meetings', 'Open requests', 'Unread']) {
    await page.getByText(metric, { exact: true }).waitFor();
  }

  const teacherOnlyHeadings = [
    'My performance',
    'Attendance trend',
    'Teaching load',
    'Group health',
    "Today's schedule",
    'Recent cards',
  ];
  for (const heading of teacherOnlyHeadings) {
    if (await page.getByRole('heading', { name: heading, exact: true }).count()) {
      throw new Error(`Staff dashboard leaked teacher-only section: ${heading}`);
    }
  }

  if (await page.getByRole('link', { name: /AI/i }).count()) {
    throw new Error('Staff dashboard leaked an AI navigation link');
  }
  if (await page.getByRole('link', { name: /Groups/i }).count()) {
    throw new Error('Staff dashboard leaked a Groups navigation link');
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`Staff dashboard overflows horizontally by ${overflow}px`);
  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);

  await browser.close();
  process.stdout.write('PASS staff dashboard excludes teacher-only analytics and actions\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
