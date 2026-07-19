// Interaction and responsive-layout regression check for Messages.
// Run against an already-running mock-mode Vite server.
const { chromium } = require('@playwright/test');
const path = require('path');
const os = require('os');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4176';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.grantPermissions(['microphone'], { origin: BASE });
  await context.addInitScript(() => localStorage.setItem('sf-locale', 'en'));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(`${BASE}/messages`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Messages' }).waitFor();
  await page.getByLabel('Search conversations…').waitFor();

  const composer = page.getByLabel('Write a message');
  await composer.fill('Quick classroom update');
  await composer.press('Enter');
  await page.getByText('Quick classroom update', { exact: true }).waitFor();

  await page.getByLabel('Open profile').first().click();
  await page.getByRole('dialog').getByText('Shared media').waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();

  await page.getByLabel('New chat').click();
  const newChat = page.getByRole('dialog');
  await newChat
    .getByText('You can message staff and students assigned to your own groups only.')
    .waitFor();
  await newChat.getByRole('heading', { name: 'My students' }).waitFor();
  await newChat.getByText('Akbarov Akmal', { exact: true }).click();
  await page.getByText('Akbarov Akmal', { exact: true }).first().waitFor();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'lesson-note.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Lesson note'),
  });
  await page.getByText('lesson-note.txt', { exact: true }).waitFor();
  await fileInput.setInputFiles([
    { name: 'board-photo.png', mimeType: 'image/png', buffer: Buffer.from('fake image') },
    { name: 'lesson-clip.mp4', mimeType: 'video/mp4', buffer: Buffer.from('fake video') },
  ]);
  await page.locator('img[alt="board-photo.png"]').waitFor();
  await page.locator('video').waitFor();

  await page.getByLabel('Record voice message').click();
  await page.getByText('Voice messages are limited to 1 minute').waitFor();
  await page.waitForTimeout(1100);
  await page.getByLabel('Stop and send').click();
  await page.locator('audio').waitFor();
  await page.waitForTimeout(300);

  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-messages-desktop.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Messages' }).waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 1) throw new Error(`Mobile Messages overflows horizontally by ${overflow}px`);
  await page.getByRole('button', { name: /Karimova Rano/ }).click();
  await page.getByLabel('Back to chats').waitFor();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: path.join(os.tmpdir(), 'starforge-messages-mobile.png'),
    fullPage: true,
  });

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write(
    'PASS Messages text, profile, eligible contacts, files, and responsive layout\n',
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
