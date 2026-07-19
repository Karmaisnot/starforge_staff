// Exhaustive route/localization/viewport health audit for the mock application.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';
const routes = [
  '/today',
  '/work',
  '/finance',
  '/people',
  '/cohorts',
  '/tasks',
  '/ai',
  '/print',
  '/surveys',
  '/messages',
  '/mgmt',
  '/cards',
  '/materials',
  '/notifications',
  '/settings',
];
const locales = ['en', 'ru', 'uz'];
const viewports =
  process.env.E2E_NARROW_ONLY === 'true'
    ? [{ name: 'narrow', width: 320, height: 568 }]
    : [
        { name: 'desktop', width: 1440, height: 980 },
        { name: 'mobile', width: 390, height: 844 },
      ];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  let checks = 0;

  for (const locale of locales) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript(
        ({ activeLocale }) => localStorage.setItem('sf-locale', activeLocale),
        { activeLocale: locale },
      );
      await context.addInitScript(() => {
        localStorage.setItem(
          'sf-mock-role',
          location.pathname === '/finance' ? 'cashier' : 'teacher',
        );
      });
      const page = await context.newPage();
      let browserErrors = [];
      page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
      });

      for (const route of routes) {
        browserErrors = [];

        try {
          const response = await page.goto(`${BASE}${route}`, {
            waitUntil: 'networkidle',
            timeout: 20000,
          });
          await page.locator('main').waitFor({ state: 'visible', timeout: 8000 });
          await page.waitForTimeout(320);
          const result = await page.evaluate(() => {
            const main = document.querySelector('main');
            const text = main?.innerText?.trim() ?? '';
            const duplicateIds = [...document.querySelectorAll('[id]')]
              .map((node) => node.id)
              .filter((id, index, all) => id && all.indexOf(id) !== index);
            const brokenImages = [...document.images]
              .filter((image) => image.complete && image.naturalWidth === 0)
              .map((image) => image.currentSrc || image.src || image.alt || 'unnamed image');
            const unnamedButtons = [...document.querySelectorAll('main button')].filter(
              (button) => {
                const label =
                  button.getAttribute('aria-label') ||
                  button.getAttribute('title') ||
                  button.innerText?.trim();
                return !label;
              },
            ).length;
            const badLinks = [...document.querySelectorAll('a')].filter(
              (link) => !link.getAttribute('href') || link.getAttribute('href') === '#',
            ).length;
            const leakedKeys = text.match(
              /\b(?:nav|common|today|work|finance|people|messages|cohorts|tasks|ai|print|surveys|mgmt|cards|materials|notifications|settings)\.[a-zA-Z0-9_.-]+\b/g,
            );
            return {
              textLength: text.length,
              overflow: document.documentElement.scrollWidth - window.innerWidth,
              duplicateIds: [...new Set(duplicateIds)],
              brokenImages,
              unnamedButtons,
              badLinks,
              leakedKeys: [...new Set(leakedKeys || [])],
              loadingVisible: /(^|\n)(Loading|Загрузка|Yuklanmoqda)…?(\n|$)/i.test(text),
            };
          });

          const prefix = `${locale}/${viewport.name}${route}`;
          if (!response || response.status() >= 400) {
            failures.push(`${prefix}: document status ${response?.status() ?? 'none'}`);
          }
          if (new URL(page.url()).pathname !== route) {
            failures.push(`${prefix}: unexpectedly redirected to ${new URL(page.url()).pathname}`);
          }
          if (result.textLength < 20) failures.push(`${prefix}: main content is effectively empty`);
          if (result.overflow > 1)
            failures.push(`${prefix}: horizontal overflow ${result.overflow}px`);
          if (result.loadingVisible) failures.push(`${prefix}: loading state never resolved`);
          if (result.duplicateIds.length) {
            failures.push(`${prefix}: duplicate ids ${result.duplicateIds.join(', ')}`);
          }
          if (result.brokenImages.length) {
            failures.push(`${prefix}: broken images ${result.brokenImages.join(', ')}`);
          }
          if (result.unnamedButtons) {
            failures.push(`${prefix}: ${result.unnamedButtons} unnamed main button(s)`);
          }
          if (result.badLinks) failures.push(`${prefix}: ${result.badLinks} invalid link(s)`);
          if (result.leakedKeys.length) {
            failures.push(`${prefix}: leaked translation keys ${result.leakedKeys.join(', ')}`);
          }
          if (browserErrors.length) failures.push(`${prefix}: ${browserErrors.join(' | ')}`);
          checks += 1;
        } catch (error) {
          failures.push(`${locale}/${viewport.name}${route}: ${error.message.split('\n')[0]}`);
        } finally {
          // The page is reused so all 90 checks remain practical in local CI.
        }
      }
      await page.close();
      await context.close();
    }
  }

  await browser.close();
  if (failures.length) {
    console.error(`FAIL deep route audit (${failures.length} findings across ${checks} checks)`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  process.stdout.write(`PASS ${checks} route/locale/viewport health checks\n`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
