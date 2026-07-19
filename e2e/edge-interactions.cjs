// Negative and keyboard/lifecycle checks that are easy to miss in happy-path E2E.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    localStorage.setItem('sf-locale', 'en');
    localStorage.setItem('sf-theme', JSON.stringify({ palette: null, dark: 'false' }));
    localStorage.setItem('sf-settings', JSON.stringify({ notifPush: 'false' }));
    localStorage.setItem('sf-dashboard-hidden-widgets', JSON.stringify([]));
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' });
  const theme = await page.locator('html').evaluate((node) => ({
    palette: node.getAttribute('data-palette'),
    mode: node.getAttribute('data-theme'),
  }));
  if (theme.palette !== 'saroy' || theme.mode !== 'light') {
    throw new Error(`Invalid stored theme was trusted: ${JSON.stringify(theme)}`);
  }
  const pushToggle = page.getByRole('button', { name: 'Push notifications' });
  if ((await pushToggle.getAttribute('aria-pressed')) !== 'true') {
    throw new Error('Invalid non-boolean stored toggle was trusted');
  }

  const editTrigger = page.getByRole('button', { name: 'Edit', exact: true });
  if (!(await editTrigger.count())) {
    throw new Error(`Settings edit trigger missing. Body: ${(await page.locator('body').innerText()).slice(0, 800)}`);
  }
  await editTrigger.focus();
  await editTrigger.click();
  const dialog = page.getByRole('dialog');
  const name = dialog.getByLabel('Full name');
  await page.waitForTimeout(100);
  await name.fill('');
  await name.pressSequentially('Focus survives rerenders', { delay: 15 });
  if ((await name.inputValue()) !== 'Focus survives rerenders') {
    throw new Error(`Modal input lost focus after rerender: ${await name.inputValue()}`);
  }
  if (!(await name.evaluate((node) => document.activeElement === node))) {
    throw new Error('Modal input is not focused after controlled rerenders');
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await page.waitForTimeout(50);
  if (!(await editTrigger.evaluate((node) => document.activeElement === node))) {
    const active = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      text: document.activeElement?.textContent?.trim(),
      aria: document.activeElement?.getAttribute?.('aria-label'),
    }));
    throw new Error(`Modal did not restore focus to its trigger: ${JSON.stringify(active)}`);
  }

  await page.keyboard.press('Control+KeyK');
  const palette = page.getByRole('dialog', { name: 'Search everything...' });
  await palette.waitFor();
  const focusableCount = await palette
    .locator('button:not([disabled]), input:not([disabled])')
    .count();
  for (let index = 0; index <= focusableCount; index += 1) await page.keyboard.press('Tab');
  const focusStayedInside = await palette.evaluate((node) => node.contains(document.activeElement));
  if (!focusStayedInside) throw new Error('Command palette lets keyboard focus escape the modal');
  await page.keyboard.press('Escape');
  await palette.waitFor({ state: 'hidden' });

  await page.goto(`${BASE}/notifications`, { waitUntil: 'networkidle' });
  if (await page.getByText('Ai', { exact: true }).count()) {
    throw new Error('Notification AI mark is incorrectly rendered as "Ai"');
  }

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write('PASS corrupted storage, modal lifecycle, keyboard trap, and AI casing\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
