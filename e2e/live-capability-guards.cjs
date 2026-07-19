// Live-adapter contract audit with a deterministic intercepted backend.
const { chromium } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://127.0.0.1:4175';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem('sf-session-access', 'e2e-live-session');
    localStorage.setItem('sf-locale', 'en');
  });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  let attendanceWrite = null;
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const ok = (data) => ({ success: true, data });
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^.*\/api\/v1\//, '');
    requests.push(`${request.method()} ${path}`);
    let data = [];

    if (path === 'users/me/') {
      data = {
        id: 7,
        full_name: 'Nigora Karimova',
        username: 'nigora',
        role_memberships: [
          { role: 'teacher', account_type_name: 'Teacher', account_kind: 'staff', branch: 1 },
        ],
      };
    } else if (path === 'ai/budget/') {
      data = { tokens_used_month: 1200, monthly_token_limit: 50000 };
    } else if (path.startsWith('ai/requests/')) {
      data = [];
    } else if (path === 'notifications/unread-count/') {
      data = { count: 0 };
    } else if (path.startsWith('tasks/mine/')) {
      data = [];
    } else if (path.startsWith('forms/')) {
      data = [
        {
          id: 10,
          title: 'Monthly teaching feedback',
          created_by: 2,
          closes_at: new Date(Date.now() + 86400000).toISOString(),
          form_fields: [{ id: 1, kind: 'text' }],
        },
      ];
    } else if (path.startsWith('messaging/threads/')) {
      data = [];
    } else if (path.startsWith('content/files/')) {
      data = [];
    } else if (path.startsWith('printing/printers/') || path.startsWith('printing/jobs/')) {
      data = [];
    } else if (path.startsWith('cohorts/1/members/')) {
      data = [
        {
          id: 1,
          cohort: 1,
          cohort_name: '9-B Algebra',
          student: 21,
          student_name: 'Akbarov Akmal',
          start_date: '2026-01-01',
          end_date: null,
        },
      ];
    } else if (path.startsWith('cohorts/')) {
      data = [
        {
          id: 1,
          name: '9-B Algebra',
          level: 'Level II',
          branch: 1,
          department_name: 'Mathematics',
          default_room_name: '304',
          is_archived: false,
        },
      ];
    } else if (path.startsWith('attendance/cohorts/1/dashboard/')) {
      data = { rate: 94, students: [] };
    } else if (path.startsWith('schedule/lessons/')) {
      const starts = new Date();
      starts.setMinutes(starts.getMinutes() - 25);
      const ends = new Date(starts);
      ends.setMinutes(ends.getMinutes() + 60);
      data = [
        {
          id: 501,
          cohort: 1,
          cohort_name: '9-B Algebra',
          starts_at: starts.toISOString(),
          ends_at: ends.toISOString(),
          status: 'scheduled',
        },
      ];
    } else if (path === 'attendance/lessons/501/mark/' && request.method() === 'POST') {
      attendanceWrite = request.postDataJSON();
      data = { created: 1, updated: 0, records: [] };
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ok(data)),
    });
  });

  await page.goto(`${BASE}/materials`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Materials' }).waitFor();
  if (await page.getByRole('button', { name: /Upload/ }).isVisible()) {
    throw new Error('Live Materials exposes an upload action without a signed-upload contract');
  }

  await page.goto(`${BASE}/print`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Print', exact: true }).waitFor();
  if (await page.getByRole('button', { name: /New print/ }).isVisible()) {
    throw new Error('Live Print exposes an unsupported quick-print action');
  }

  await page.goto(`${BASE}/surveys`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Surveys' }).waitFor();
  const startSurvey = page.getByRole('button', { name: 'Start' });
  await startSurvey.waitFor();
  if (!(await startSurvey.isDisabled()))
    throw new Error('Live fixed survey form is still actionable');

  await page.goto(`${BASE}/mgmt`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Management' }).waitFor();
  if (await page.getByRole('button', { name: 'New message' }).isVisible()) {
    throw new Error('Live Management exposes free-text thread creation without participant IDs');
  }

  const cohortRequestsBeforeMessages = requests.filter((item) => item.includes('cohorts/')).length;
  await page.goto(`${BASE}/messages`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Messages' }).waitFor();
  const cohortRequestsAfterMessages = requests.filter((item) => item.includes('cohorts/')).length;
  if (cohortRequestsAfterMessages !== cohortRequestsBeforeMessages) {
    throw new Error(
      'Live Messages queried group rosters even though thread creation cannot use profile IDs',
    );
  }

  await page.goto(`${BASE}/ai`, { waitUntil: 'networkidle' });
  const aiInput = page.getByLabel('Message to AI');
  if ((await aiInput.count()) > 0 && !(await aiInput.isDisabled())) {
    throw new Error('Live AI chat is enabled against a jobs-only API');
  }

  await page.goto(`${BASE}/cohorts`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'Groups' }).waitFor();
  await page.getByRole('button', { name: 'Take attendance' }).click();
  const attendanceDialog = page.getByRole('dialog');
  await attendanceDialog.getByText('Akbarov Akmal', { exact: true }).waitFor();
  await attendanceDialog.getByRole('button', { name: '1/1' }).click();
  await page.waitForTimeout(300);
  if (!Array.isArray(attendanceWrite) || attendanceWrite[0]?.student !== 21) {
    throw new Error(
      `Attendance did not resolve today's lesson correctly: ${JSON.stringify(attendanceWrite)}`,
    );
  }

  if (errors.length) throw new Error(`Browser errors: ${[...new Set(errors)].join(' | ')}`);
  await browser.close();
  process.stdout.write('PASS live capability guards and scheduled-lesson attendance contract\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
