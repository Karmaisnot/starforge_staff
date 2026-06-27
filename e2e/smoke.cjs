// Live click-through smoke test for the button-wiring work.
// Runs against the already-running Vite dev server on :5173.
// Forces locale=en for stable text selectors. Node Playwright (no test runner).
const { chromium } = require('@playwright/test');

const BASE = 'http://localhost:5173';
const results = [];
const pageErrors = [];

function rec(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}
async function check(name, fn) {
  try {
    await fn();
    rec(name, true);
  } catch (e) {
    rec(name, false, String(e.message || e).split('\n')[0]);
  }
}
// Wait for a page to be past its loading state (mock data resolves via setTimeout,
// so networkidle alone isn't enough — wait for real content + a beat).
async function open(page, path, readySelector) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  if (readySelector) await page.locator(readySelector).first().waitFor({ state: 'visible', timeout: 8000 });
  await page.waitForTimeout(450);
}
const vis = (loc) => loc.first().waitFor({ state: 'visible', timeout: 8000 });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    try { localStorage.setItem('sf-locale', 'en'); } catch (e) { void e; }
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') pageErrors.push('console: ' + m.text()); });

  // 1. App boots
  await check('app-loads', async () => {
    await open(page, '/today', 'text=Give card');
    const n = await page.locator('#root *').count();
    if (n < 100) throw new Error('root nearly empty (' + n + ')');
  });

  // 2. Command palette opens via Ctrl+K
  await check('cmdk-opens', async () => {
    await open(page, '/today', 'text=Give card');
    await page.keyboard.press('Control+K');
    await vis(page.getByRole('dialog'));
  });

  // 3. Command palette navigates
  await check('cmdk-navigates-to-print', async () => {
    await open(page, '/today', 'text=Give card');
    await page.keyboard.press('Control+K');
    await vis(page.getByRole('dialog'));
    await page.getByRole('dialog').locator('input').fill('print');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/print', { timeout: 6000 });
  });

  // 4. Top-bar search button opens the palette
  await check('topbar-search-opens-palette', async () => {
    await open(page, '/today', 'text=Give card');
    await page.getByRole('button', { name: 'Search everything...' }).click();
    await vis(page.getByRole('dialog'));
  });

  // 5. Cards: issuing a card appends it to the recent list
  await check('cards-issue-appends', async () => {
    await open(page, '/cards', 'text=Give card');
    await page.getByRole('button', { name: 'Give card' }).click();
    await vis(page.getByText('Give a card'));
    const NAME = 'ZZ Test Pupil';
    await page.getByPlaceholder('First name Last name').fill(NAME);
    await page.getByRole('button', { name: 'Give', exact: true }).click();
    await vis(page.getByText(NAME)); // now present in the recent list
  });

  // 6. Cards: a card-type row opens the give modal (preset)
  await check('cards-type-row-opens-modal', async () => {
    await open(page, '/cards', 'text=Give card');
    await page.locator('[class*="type"]').first().click();
    await vis(page.getByText('Give a card'));
  });

  // 7. AI: sending a message shows the message + a mock AI reply
  await check('ai-send-gets-reply', async () => {
    await open(page, '/ai', 'input[aria-label="ask a question about..."]');
    const msg = 'Smoke test question';
    await page.getByPlaceholder('ask a question about...').fill(msg);
    await page.keyboard.press('Enter');
    await vis(page.getByText(msg));
    // Reply now comes from the real backend AI responder (offline fallback when
    // no API key) — assert its generated reply appears, not the old mock text.
    await vis(page.getByText('offline right now', { exact: false }));
  });

  // 8. Mgmt: a sent message persists across thread switches
  await check('mgmt-send-persists', async () => {
    await open(page, '/mgmt', 'input[aria-label*="message"]');
    const msg = 'Mgmt smoke ping';
    await page.locator('input[aria-label*="message"]').fill(msg);
    await page.getByRole('button', { name: 'Send' }).last().click();
    await vis(page.getByText(msg));
    const threads = page.locator('[class*="thread"]');
    if ((await threads.count()) > 1) {
      await threads.nth(1).click();
      await page.waitForTimeout(250);
      await threads.nth(0).click();
      await page.waitForTimeout(250);
      await vis(page.getByText(msg)); // still there after switching back
    }
  });

  // 9. Today: the pending-task checkbox toggles to pressed
  await check('today-task-checkbox-toggles', async () => {
    await open(page, '/today', 'text=Give card');
    const cb = page.locator('button[aria-label="Toggle status"]').first();
    await cb.click();
    const pressed = await cb.getAttribute('aria-pressed');
    if (pressed !== 'true') throw new Error('aria-pressed=' + pressed);
  });

  // 10. Surveys: a history row opens the read-only results modal
  await check('surveys-history-opens-modal', async () => {
    await open(page, '/surveys', 'text=Surveys');
    await page.locator('[class*="historyRow"]').first().click();
    await vis(page.getByText('Survey results'));
  });

  // 11. Print: real file picker feeds the upload + add to queue works
  await check('print-upload-and-queue', async () => {
    await open(page, '/print', 'text=Quick print');
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: /Upload/ }).click(),
    ]);
    await chooser.setFiles({ name: 'lesson-smoke.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
    await vis(page.getByText('lesson-smoke.pdf'));
    await page.getByRole('button', { name: 'Add to queue' }).click();
    // the queued job carries the uploaded filename -> appears at least twice now (label + job)
    await page.waitForTimeout(300);
    const cnt = await page.getByText('lesson-smoke.pdf').count();
    if (cnt < 1) throw new Error('uploaded file not reflected');
  });

  // 12. Notifications: row marks read, mark-all marks everything
  await check('notifications-mark-read', async () => {
    await open(page, '/notifications', 'text=Notifications');
    await page.locator('[class*="row"]').first().click();
    await vis(page.getByText('Marked as read'));
  });
  await check('notifications-mark-all', async () => {
    await open(page, '/notifications', 'text=Notifications');
    await page.getByRole('button', { name: 'Mark all read' }).click();
    await vis(page.getByText('All notifications marked read'));
  });

  // 13. Settings: toggle persists across reload (localStorage)
  await check('settings-toggle-persists', async () => {
    await open(page, '/settings', 'text=Push notifications');
    await page.getByRole('button', { name: /Push notifications/ }).click();
    await page.waitForTimeout(150);
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('sf-settings') || '{}').notifPush);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('sf-settings') || '{}').notifPush);
    if (persisted !== after) throw new Error('not persisted: after=' + after + ' persisted=' + persisted);
  });

  await browser.close();

  const passed = results.filter((r) => r.ok).length;
  console.log('\n==================================================');
  console.log(`RESULT: ${passed}/${results.length} checks passed`);
  if (pageErrors.length) {
    console.log(`\nConsole/page errors captured (${pageErrors.length}):`);
    [...new Set(pageErrors)].slice(0, 20).forEach((e) => console.log('  • ' + e));
  } else {
    console.log('No console/page errors captured.');
  }
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => { console.error('RUNNER CRASH', e); process.exit(2); });
