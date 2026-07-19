const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';
const cases = [
  ['en', '/cohorts'],
  ['ru', '/print'],
  ['uz', '/print'],
  ['ru', '/messages'],
  ['en', '/mgmt'],
  ['ru', '/materials'],
  ['uz', '/notifications'],
  ['uz', '/surveys'],
  ['ru', '/settings'],
  ['ru', '/finance'],
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [locale, route] of cases) {
    const context = await browser.newContext({ viewport: { width: 320, height: 568 } });
    await context.addInitScript(
      ({ activeLocale, activeRoute }) => {
        localStorage.setItem('sf-locale', activeLocale);
        localStorage.setItem('sf-mock-role', activeRoute === '/finance' ? 'cashier' : 'teacher');
      },
      { activeLocale: locale, activeRoute: route },
    );
    const page = await context.newPage();
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const report = await page.evaluate(() => {
      const width = window.innerWidth;
      const nodes = [...document.querySelectorAll('body *')]
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            tag: node.tagName.toLowerCase(),
            cls: typeof node.className === 'string' ? node.className.slice(0, 90) : '',
            text: (node.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            scroll: Math.round(node.scrollWidth - node.clientWidth),
            minWidth: style.minWidth,
            whiteSpace: style.whiteSpace,
            display: style.display,
          };
        })
        .filter((item) => item.right > width + 1 || item.left < -1 || item.scroll > 1)
        .sort((a, b) => Math.max(b.right - width, b.scroll) - Math.max(a.right - width, a.scroll))
        .slice(0, 8);
      return { overflow: document.documentElement.scrollWidth - width, nodes };
    });
    console.log(`\n${locale}${route} overflow=${report.overflow}`);
    for (const node of report.nodes) console.log(JSON.stringify(node));
    await context.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
