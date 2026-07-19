// Adapters for the supplied Starforge EDU tenant API.  The UI was originally
// prototyped against a different Fastify service, so this module deliberately
// translates the stable UI ports into the API's /api/v1 resources and DTOs.
import { getLocale } from '@/i18n/locale.js';
import { ApiError } from '@/data/http/apiError.js';
import { httpClient } from '@/data/http/httpClient.js';
import {
  IAccountRepository,
  ICohortRepository,
  ICardRepository,
  ITaskRepository,
  IDashboardRepository,
  IAiRepository,
  IPrintRepository,
  ISurveyRepository,
  IMgmtRepository,
  INotificationRepository,
  IMaterialRepository,
} from '../interfaces.js';

const UI_TASK_COLUMNS = [
  { id: 'todo', color: 'var(--sf-muted)' },
  { id: 'doing', color: 'var(--sf-primary)' },
  { id: 'review', color: 'var(--sf-accent)' },
  { id: 'done', color: 'var(--sf-success)' },
];

const COPY = {
  uz: {
    all: 'Barchasi',
    today: 'Bugun',
    yesterday: 'Kecha',
    todo: 'Boshlanmagan',
    doing: 'Jarayonda',
    review: 'Tekshirishda',
    done: 'Tugallangan',
    me: 'Men',
    teacher: 'O‘qituvchi',
    branch: 'Filial',
    group: 'guruh',
    student: 'o‘quvchi',
    lesson: 'dars',
    pending: 'kutilmoqda',
    noLessons: 'Rejalashtirilgan dars yo‘q',
    nextLesson: 'Keyingi dars',
    noForms: 'Kutilayotgan so‘rovnomalar yo‘q',
    aiRequest: 'AI so‘rovi',
    thread: 'Suhbat',
    form: 'So‘rovnoma',
    files: 'fayl',
    queued: 'Navbatda',
  },
  ru: {
    all: 'Все',
    today: 'Сегодня',
    yesterday: 'Вчера',
    todo: 'Не начато',
    doing: 'В работе',
    review: 'На проверке',
    done: 'Готово',
    me: 'Я',
    teacher: 'Преподаватель',
    branch: 'Филиал',
    group: 'групп',
    student: 'учеников',
    lesson: 'уроков',
    pending: 'ожидают',
    noLessons: 'Запланированных уроков нет',
    nextLesson: 'Следующий урок',
    noForms: 'Нет ожидающих опросов',
    aiRequest: 'AI-запрос',
    thread: 'Диалог',
    form: 'Опрос',
    files: 'файлов',
    queued: 'В очереди',
  },
  en: {
    all: 'All',
    today: 'Today',
    yesterday: 'Yesterday',
    todo: 'To do',
    doing: 'In progress',
    review: 'In review',
    done: 'Done',
    me: 'Me',
    teacher: 'Teacher',
    branch: 'Branch',
    group: 'groups',
    student: 'students',
    lesson: 'lessons',
    pending: 'pending',
    noLessons: 'No lessons are scheduled',
    nextLesson: 'Next lesson',
    noForms: 'No forms are waiting',
    aiRequest: 'AI request',
    thread: 'Thread',
    form: 'Form',
    files: 'files',
    queued: 'Queued',
  },
};

function copy() {
  return COPY[getLocale()] ?? COPY.en;
}

function localeTag() {
  return { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }[getLocale()] ?? 'en-US';
}

/** The API uses both envelope pagination and a cursor feed for notifications. */
function asList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function validDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function formatDate(value, options = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  const date = validDate(value);
  return date ? new Intl.DateTimeFormat(localeTag(), options).format(date) : '—';
}

function formatTime(value) {
  return formatDate(value, { hour: '2-digit', minute: '2-digit' });
}

function formatDeadline(value) {
  const date = validDate(value);
  if (!date) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month} · ${hour}:${minute}`;
}

function displayName(row) {
  return (
    row?.full_name ||
    [row?.first_name, row?.last_name].filter(Boolean).join(' ') ||
    row?.username ||
    '—'
  );
}

function dateLabelForDay(value) {
  const date = validDate(value);
  if (!date) return '—';
  const dayMs = 24 * 60 * 60 * 1000;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const theirs = new Date(date);
  theirs.setHours(0, 0, 0, 0);
  const offset = Math.round((start - theirs) / dayMs);
  if (offset === 0) return copy().today;
  if (offset === 1) return copy().yesterday;
  return formatDate(date, { day: '2-digit', month: 'short' });
}

function clientContractError(path, message) {
  return new ApiError(422, 'LOCAL', path, {
    code: 'frontend_contract_mismatch',
    message,
  });
}

async function optional(load, fallback) {
  try {
    return await load();
  } catch (error) {
    // A missing session must still reach SessionGate. Other optional panels can
    // remain empty when a role lacks a capability such as printing:read.
    if (error?.status === 401) throw error;
    return fallback;
  }
}

function splitFullName(name) {
  const parts = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return {
    first_name: parts.shift() ?? '',
    last_name: parts.join(' '),
  };
}

function mapTeacher(user) {
  const membership = user?.role_memberships?.[0] ?? {};
  // The tenant API calls this `account_type_name` (for example, "Director"),
  // while older mock payloads used `role`. Accept both so staff never appears
  // as a teacher simply because the field name changed.
  const rawRole =
    membership.account_type_name ?? membership.role ?? membership.account_type_slug ?? null;
  const role = rawRole ? String(rawRole).replaceAll('_', ' ') : copy().teacher;
  return {
    id: user?.id,
    name: displayName(user),
    username: user?.username ?? '',
    // /users/me/ intentionally does not permit username changes.
    usernameEditable: false,
    role,
    branchId: membership.branch ?? null,
    branch: membership.branch ? `${copy().branch} #${membership.branch}` : '—',
    subjects: [],
  };
}

function hasTeacherMembership(user) {
  return asList(user?.role_memberships).some(
    (membership) => membership?.account_kind === 'teacher',
  );
}

function mapDevice(device) {
  return {
    id: device.id,
    platform: device.platform,
    userAgent: device.user_agent,
    lastSeenAt: device.last_seen_at,
    createdAt: device.created_at,
  };
}

function mapCohort(cohort, details = {}) {
  return {
    id: String(cohort.id),
    name: cohort.name ?? '',
    level: cohort.level || '—',
    subject: cohort.department_name || '—',
    studentCount: toNumber(details.studentCount, 0),
    attendance: toNumber(details.attendance, 0),
    up: 0,
    down: 0,
    next: cohort.default_room_name || '—',
    color: cohort.is_archived ? 'var(--sf-muted)' : 'var(--sf-primary)',
    room: cohort.default_room_name || '—',
  };
}

function mapRosterMember(member, attendanceByStudent) {
  const attendance = attendanceByStudent.get(String(member.student));
  const percent = attendance ? toNumber(attendance.percent_present, 0) : 0;
  return {
    id: String(member.student),
    name: member.student_name || `${copy().student} #${member.student}`,
    studentId: attendance?.student_code || String(member.student),
    up: 0,
    down: 0,
    attendance: percent,
    flag: percent > 0 && percent < 75 ? 'warn' : percent >= 95 ? 'top' : null,
  };
}

function mapTask(task) {
  const status =
    {
      open: 'todo',
      in_progress: 'doing',
      blocked: 'review',
      done: 'done',
      cancelled: 'done',
    }[task.status] ?? 'todo';
  const priority =
    {
      urgent: 'P1',
      high: 'P2',
      normal: 'P2',
      low: 'P3',
    }[task.priority] ?? 'P3';
  return {
    id: task.id,
    title: task.title ?? '',
    priority,
    state: status,
    project:
      task.department_name ||
      (task.department ? `${copy().branch} #${task.department}` : copy().all),
    projectColor: task.priority === 'urgent' ? 'var(--sf-danger)' : 'var(--sf-primary)',
    deadline: formatDeadline(task.due_at),
    urgent: task.priority === 'urgent',
    fromMgmt: Boolean(task.created_by && task.assignee && task.created_by !== task.assignee),
    subtasks: null,
    assigner: task.assignee ? `#${task.assignee}` : copy().me,
    mine: false,
  };
}

function apiTaskStatus(state) {
  return (
    {
      todo: 'open',
      doing: 'in_progress',
      review: 'blocked',
      done: 'done',
    }[state] ?? 'open'
  );
}

function apiTaskPriority(priority) {
  return { P1: 'urgent', P2: 'normal', P3: 'low' }[priority] ?? 'normal';
}

function taskColumns() {
  const labels = copy();
  return UI_TASK_COLUMNS.map((column) => ({ ...column, label: labels[column.id] }));
}

function taskFilters(tasks) {
  const count = (predicate) => tasks.filter(predicate).length;
  return [
    { key: 'all', label: copy().all, count: tasks.length },
    { key: 'mine', label: copy().me, count: count((task) => task.mine) },
    { key: 'mgmt', label: 'Management', count: count((task) => task.fromMgmt) },
    { key: 'urgent', label: 'P1', count: count((task) => task.urgent) },
    { key: 'done', label: copy().done, count: count((task) => task.state === 'done') },
  ];
}

function notificationPresentation(eventType) {
  const key = String(eventType ?? '').toLowerCase();
  if (key.includes('ai')) return { tone: 'ai', icon: 'AI' };
  if (key.includes('print')) return { tone: 'success', icon: 'print' };
  if (key.includes('message') || key.includes('chat')) return { tone: 'accent', icon: 'chat' };
  if (key.includes('task')) return { tone: 'primary', icon: 'flag' };
  if (key.includes('attendance')) return { tone: 'success', icon: 'check' };
  if (key.includes('card')) return { tone: 'warn', icon: 'brand' };
  return { tone: 'neutral', icon: 'bell' };
}

function mapNotification(notification) {
  return {
    id: String(notification.id),
    ...notificationPresentation(notification.event_type),
    title: notification.title || notification.event_type || '—',
    body: notification.body || '',
    time: formatTime(notification.created_at),
    createdAt: notification.created_at,
    read: Boolean(notification.read_at),
  };
}

function notificationGroups(rows) {
  const groups = new Map();
  for (const row of rows.map(mapNotification)) {
    const source = row.createdAt;
    const label = dateLabelForDay(source);
    const group = groups.get(label) ?? { label, items: [] };
    group.items.push(row);
    groups.set(label, group);
  }
  return [...groups.values()];
}

function notificationFilters(rows) {
  const all = rows.map(mapNotification);
  const count = (predicate) => all.filter(predicate).length;
  return [
    { key: 'all', label: copy().all, count: all.length },
    { key: 'ai', label: 'AI', count: count((row) => row.tone === 'ai') },
    { key: 'print', label: 'Print', count: count((row) => row.icon === 'print') },
    { key: 'msg', label: 'Messages', count: count((row) => row.icon === 'chat') },
  ];
}

function inferCardKind(name) {
  const value = String(name ?? '').toLowerCase();
  return value.includes('down') ||
    value.includes('warn') ||
    value.includes('minus') ||
    value.includes('negative')
    ? 'down'
    : 'up';
}

function mapCardType(type, cards = []) {
  return {
    id: type.id,
    name: type.name ?? `#${type.id}`,
    subtitle: type.is_active ? 'Active' : 'Inactive',
    kind: inferCardKind(type.name),
    count: cards.filter((card) => card.card_type === type.id).length,
  };
}

function mapCard(card, typeById) {
  const type = typeById.get(String(card.card_type));
  const typeName = type?.name ?? `#${card.card_type}`;
  return {
    id: String(card.id),
    recipient: `${copy().student} #${card.student}`,
    cohort: '',
    typeName,
    kind: inferCardKind(typeName),
    reason: card.code ? `Code: ${card.code}` : '—',
    issuer: card.issued_by ? `#${card.issued_by}` : '',
    when: formatTime(card.issued_at),
  };
}

function mapPrinter(printer) {
  const capabilities =
    printer.capabilities && typeof printer.capabilities === 'object' ? printer.capabilities : {};
  const sizes = capabilities.paper_sizes ?? capabilities.sizes ?? capabilities.formats ?? '—';
  return {
    id: String(printer.id),
    name: [printer.name, printer.model_name].filter(Boolean).join(' · ') || `#${printer.id}`,
    location: printer.branch ? `${copy().branch} #${printer.branch}` : '—',
    status: printer.is_active ? 'free' : 'locked',
    eta: printer.is_active ? '—' : '—',
    queue: 0,
    color: Boolean(capabilities.color || capabilities.colour),
    sizes: Array.isArray(sizes) ? sizes.join(' · ') : String(sizes),
    accent: printer.is_active ? 'var(--sf-success)' : 'var(--sf-muted)',
  };
}

function mapPrintJob(job) {
  const now = job.status === 'printing';
  return {
    id: String(job.id),
    doc: job.source
      ? `${job.source}${job.source_id ? ` #${job.source_id}` : ''}`
      : `Job #${job.id}`,
    icon: 'doc',
    copies: toNumber(job.copies, 1),
    size: `${job.pages ?? '—'} pages${job.color ? ' · color' : ''}`,
    printer: job.printer ? `#${job.printer}` : '—',
    progress: job.pages
      ? Math.min(100, Math.round((toNumber(job.pages_printed) / job.pages) * 100))
      : 0,
    eta: job.last_error || (now ? 'Printing' : copy().queued),
    state: now ? 'now' : 'queued',
  };
}

function mapForm(form) {
  const questions = Array.isArray(form.form_fields) ? form.form_fields.length : 0;
  const deadline = formatDeadline(form.closes_at);
  const close = validDate(form.closes_at);
  const remainingMs = close ? close.getTime() - Date.now() : Number.POSITIVE_INFINITY;
  return {
    id: String(form.id),
    title: form.title || copy().form,
    issuer: form.created_by ? `#${form.created_by}` : '—',
    deadline,
    remaining: close ? formatDate(form.closes_at, { day: '2-digit', month: 'short' }) : '—',
    questions,
    estimate: '—',
    progress: 0,
    urgent: remainingMs >= 0 && remainingMs < 3 * 24 * 60 * 60 * 1000,
  };
}

function mapThread(thread) {
  return {
    id: String(thread.id),
    name: thread.subject || `${copy().thread} #${thread.id}`,
    lead: false,
    role: copy().thread,
    lastMessage: '',
    time: formatTime(thread.last_message_at ?? thread.created_at),
    unread: toNumber(thread.unread_count),
    online: false,
    pinned: false,
    channel: false,
  };
}

function mapMessage(message, currentUserId) {
  return {
    id: String(message.id),
    dir: String(message.sender) === String(currentUserId) ? 'out' : 'in',
    text: message.body ?? '',
    time: formatTime(message.created_at),
    read: false,
  };
}

function materialKind(contentType) {
  const value = String(contentType ?? '').toLowerCase();
  if (value.includes('pdf')) return 'pdf';
  if (value.includes('video')) return 'video';
  if (value.includes('word') || value.includes('document') || value.includes('text')) return 'doc';
  return 'doc';
}

function bytesLabel(value) {
  const bytes = toNumber(value);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function mapMaterial(file) {
  const kind = materialKind(file.content_type);
  const color = { pdf: 'var(--sf-danger)', video: 'var(--sf-primary)', doc: 'var(--sf-accent)' }[
    kind
  ];
  return {
    id: String(file.id),
    title: file.title || `File #${file.id}`,
    meta: bytesLabel(file.size_bytes),
    kind,
    color,
    views: toNumber(file.view_count),
    date: formatDate(file.created_at, { day: '2-digit', month: 'short' }),
    aiSummary: false,
  };
}

function emptyAiTranscript() {
  return {
    outgoing1: '',
    reply: {
      leadItalic: '',
      leadRest: '',
      stats: [],
      bar: [],
      focusStudents: [],
      recommendationItalic: '',
      recommendationRest: '',
      actions: [],
      meta: '',
    },
    outgoing2: '',
  };
}

export class HttpAccountRepository extends IAccountRepository {
  #settings = {};

  async getTeacher() {
    return mapTeacher(await httpClient.get('users/me/'));
  }

  async updateTeacher(patch) {
    const body = patch?.name ? splitFullName(patch.name) : {};
    if (Object.keys(body).length === 0) return this.getTeacher();
    return mapTeacher(await httpClient.patch('users/me/', body));
  }

  async getSettings() {
    const user = await httpClient.get('users/me/');
    return { ...this.#settings, locale: user.preferred_language ?? getLocale() };
  }

  async patchSettings(patch) {
    const next = { ...this.#settings, ...patch };
    if (patch?.locale) {
      await httpClient.patch('users/me/', { preferred_language: patch.locale });
    }
    this.#settings = next;
    return { ...next };
  }

  async listSessions() {
    return asList(await httpClient.get('users/devices/')).map(mapDevice);
  }

  ejectSession(id) {
    return httpClient.delete(`users/devices/${id}/`);
  }
}

export class HttpCohortRepository extends ICohortRepository {
  async #details(cohort) {
    const [members, attendance] = await Promise.all([
      optional(() => httpClient.get(`cohorts/${cohort.id}/members/`), []),
      optional(() => httpClient.get(`attendance/cohorts/${cohort.id}/dashboard/`), null),
    ]);
    return mapCohort(cohort, {
      studentCount: asList(members).length,
      attendance: attendance?.rate,
    });
  }

  async list() {
    const rows = asList(await httpClient.get('cohorts/?page_size=100'));
    return Promise.all(rows.map((row) => this.#details(row)));
  }

  async getById(id) {
    return this.#details(await httpClient.get(`cohorts/${id}/`));
  }

  async getRoster(cohortId) {
    const [members, dashboard] = await Promise.all([
      httpClient.get(`cohorts/${cohortId}/members/`),
      optional(() => httpClient.get(`attendance/cohorts/${cohortId}/dashboard/`), null),
    ]);
    const attendanceByStudent = new Map(
      asList(dashboard?.students).map((student) => [String(student.student), student]),
    );
    return asList(members).map((member) => mapRosterMember(member, attendanceByStudent));
  }

  async create(draft) {
    const branch = Number(draft?.branch);
    const startDate = draft?.start_date ?? draft?.startDate;
    const endDate = draft?.end_date ?? draft?.endDate;
    if (!Number.isInteger(branch) || branch < 1 || !startDate || !endDate) {
      throw clientContractError(
        'cohorts/',
        'Creating a cohort requires a branch, start date, and end date. The current form must collect these fields first.',
      );
    }
    const created = await httpClient.post('cohorts/', {
      name: draft.name,
      level: draft.level ?? '',
      branch,
      start_date: startDate,
      end_date: endDate,
    });
    return this.#details(created);
  }

  async saveAttendance(_cohortId, entries) {
    const lessonId = entries?.lessonId;
    if (!lessonId) {
      throw clientContractError(
        'attendance/lessons/{lesson_id}/mark/',
        'Attendance is recorded against a scheduled lesson, not a cohort. Select the lesson before saving attendance.',
      );
    }
    const payload = asList(entries).map((entry) => ({
      student: Number(entry.studentId),
      status: entry.present ? 'present' : 'absent',
    }));
    return httpClient.post(`attendance/lessons/${lessonId}/mark/`, payload);
  }
}

export class HttpCardRepository extends ICardRepository {
  #snapshot = null;

  async #loadSnapshot() {
    if (!this.#snapshot) {
      this.#snapshot = Promise.all([
        httpClient.get('cards/?page_size=100'),
        httpClient.get('cards/types/?page_size=100'),
      ]).then(([cards, types]) => ({ cards: asList(cards), types: asList(types) }));
    }
    return this.#snapshot;
  }

  async listRecent() {
    const { cards, types } = await this.#loadSnapshot();
    const typeById = new Map(types.map((type) => [String(type.id), type]));
    return [...cards]
      .sort((a, b) => String(b.issued_at ?? '').localeCompare(String(a.issued_at ?? '')))
      .slice(0, 10)
      .map((card) => mapCard(card, typeById));
  }

  async listTypes() {
    const { cards, types } = await this.#loadSnapshot();
    return types.map((type) => mapCardType(type, cards));
  }

  async getStats() {
    const { cards, types } = await this.#loadSnapshot();
    const typed = types.map((type) => mapCardType(type, cards));
    const up = cards.filter(
      (card) => inferCardKind(typed.find((type) => type.id === card.card_type)?.name) === 'up',
    ).length;
    const recipients = new Set(cards.map((card) => card.student)).size;
    return {
      upThisWeek: up,
      downThisWeek: cards.length - up,
      recipients,
      typeCount: types.length,
      typeVersion: '',
      upTrend: '',
    };
  }

  async issue(input) {
    const requestedStudent = input?.student ?? input?.studentId ?? input?.recipient;
    const directId = Number(requestedStudent);
    let student = directId;

    // The UI accepts a teacher-friendly student name, whereas POST /cards/
    // needs an id. Resolve a unique directory match before issuing instead of
    // making every non-numeric entry fail locally.
    if (!Number.isInteger(directId) || directId < 1) {
      const query = String(requestedStudent ?? '').trim();
      if (query) {
        const matches = asList(
          await httpClient.get(`students/?page_size=5&search=${encodeURIComponent(query)}`),
        );
        const normalized = query.toLocaleLowerCase();
        const exact = matches.find((candidate) => {
          const name = String(candidate.full_name ?? '')
            .trim()
            .toLocaleLowerCase();
          return name === normalized;
        });
        const match = exact ?? (matches.length === 1 ? matches[0] : null);
        student = Number(match?.id);
      }
    }

    if (!Number.isInteger(student) || student < 1) {
      throw clientContractError(
        'cards/',
        'No matching student was found. Enter the full name exactly as it appears in the student directory.',
      );
    }
    const { types } = await this.#loadSnapshot();
    const selectedType = types.find((type) => type.name === input?.typeName);
    if (!selectedType) {
      throw clientContractError(
        'cards/',
        'Choose an active card type from the tenant card catalogue.',
      );
    }
    const created = await httpClient.post('cards/', { student, card_type: selectedType.id });
    this.#snapshot = null;
    return created;
  }
}

export class HttpTaskRepository extends ITaskRepository {
  #listRequest = null;

  async list() {
    if (!this.#listRequest) {
      this.#listRequest = httpClient
        .get('tasks/?page_size=100')
        .then((payload) => asList(payload).map(mapTask))
        .finally(() => {
          this.#listRequest = null;
        });
    }
    return this.#listRequest;
  }

  listColumns() {
    return Promise.resolve(taskColumns());
  }

  async listFilters() {
    return taskFilters(await this.list());
  }

  async setState(id, state) {
    return mapTask(
      await httpClient.post(`tasks/${id}/transition/`, { status: apiTaskStatus(state) }),
    );
  }

  async create(draft) {
    return mapTask(
      await httpClient.post('tasks/', {
        title: draft.title,
        priority: apiTaskPriority(draft.priority),
      }),
    );
  }
}

export class HttpDashboardRepository extends IDashboardRepository {
  async getToday() {
    const [me, rawTasks] = await Promise.all([
      optional(() => httpClient.get('users/me/'), null),
      optional(() => httpClient.get('tasks/mine/?page_size=5'), []),
    ]);
    // This endpoint is only installed for teacher account types. Staff such as a
    // Director receive a lean but complete dashboard instead of a 404 page.
    const dashboard = hasTeacherMembership(me)
      ? await optional(() => httpClient.get('teachers/dashboard/'), {})
      : {};
    const lessons = asList(dashboard.next_lessons);
    const next = lessons[0] ?? null;
    const tasks = asList(rawTasks)
      .map(mapTask)
      .filter((task) => task.state !== 'done');
    const form = asList(dashboard.pending_forms)[0] ?? null;
    const groups = toNumber(dashboard.groups_count);
    const students = toNumber(dashboard.students_count);
    const meeting = dashboard.next_meeting;
    const name = displayName(me).split(' ')[0] || '';
    return {
      meta: {
        dateLabel: formatDate(new Date(), {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        greetingName: name,
        summary: `${groups} ${copy().group} · ${lessons.length} ${copy().lesson} · ${students} ${copy().student}`,
      },
      surveyBanner: form
        ? {
            remaining: formatDeadline(form.closes_at),
            title: form.title,
            meta: `${toNumber(form.questions, 0)} ${copy().pending}`,
          }
        : null,
      stats: [
        { value: String(groups), label: copy().group },
        { value: String(students), label: copy().student, color: 'var(--sf-success)' },
        { value: String(lessons.length), label: copy().lesson, color: 'var(--sf-primary)' },
        { value: String(tasks.length), label: copy().pending, color: 'var(--sf-accent)' },
      ],
      heroLesson: next
        ? {
            eyebrow: copy().nextLesson,
            title: next.title || next.cohort || copy().nextLesson,
            titleAccent: next.cohort || '',
            sub: next.lesson_type || next.cohort || '',
            start: formatTime(next.starts_at),
            end: next.ends_at ? `– ${formatTime(next.ends_at)}` : '',
          }
        : {
            eyebrow: copy().nextLesson,
            title: copy().noLessons,
            titleAccent: '',
            sub: '',
            start: '—',
            end: '',
          },
      schedule: lessons.map((lesson, index) => ({
        time: formatTime(lesson.starts_at),
        label: lesson.title || lesson.cohort || copy().nextLesson,
        room: lesson.cohort || '',
        state: index === 0 ? 'next' : 'planned',
      })),
      recentCards: [],
      pendingTasks: tasks,
      aiInsight: {
        eyebrow: 'AI',
        count: '',
        quote: '',
        chips: [],
      },
      printQueue: [],
      mgmtMention: meeting
        ? {
            name: meeting.title || copy().thread,
            role: copy().nextLesson,
            message: meeting.location || '',
            time: formatTime(meeting.starts_at),
          }
        : { name: copy().thread, role: '', message: '', time: '' },
      spotlight: {
        name: Object.keys(dashboard.level_groups ?? {})[0] || '—',
        sub: `${groups} ${copy().group}`,
        tone: 'neutral',
        toneLabel: '',
        stats: [],
      },
      activity: [],
    };
  }
}

export class HttpAiRepository extends IAiRepository {
  #unavailable = false;

  #conversationsRequest = null;

  #usageRequest = null;

  #fallbackUsage() {
    return { used: 0, limit: 0, unavailable: true };
  }

  #markUnavailable(error) {
    // A missing session must still reach SessionGate. A disabled or degraded AI
    // provider should not take down the rest of the teacher workspace.
    if (error?.status === 401) throw error;
    this.#unavailable = true;
  }

  async listConversations() {
    if (this.#unavailable) return [];
    if (!this.#conversationsRequest) {
      this.#conversationsRequest = httpClient
        .get('ai/requests/?page_size=50', { retry: false })
        .then((payload) =>
          asList(payload).map((request, index) => ({
            id: String(request.id),
            name: `${copy().aiRequest} · ${request.feature ?? request.id}`,
            sub: request.status ?? '',
            time: formatTime(request.created_at),
            preview: '',
            pinned: false,
            active: index === 0,
            color: 'var(--sf-ai)',
            isAll: true,
          })),
        )
        .catch((error) => {
          this.#markUnavailable(error);
          return [];
        })
        .finally(() => {
          this.#conversationsRequest = null;
        });
    }
    return this.#conversationsRequest;
  }

  async getUsage() {
    if (this.#unavailable) return this.#fallbackUsage();
    if (!this.#usageRequest) {
      this.#usageRequest = httpClient
        .get('ai/budget/', { retry: false })
        .then((budget) => ({
          used: toNumber(budget.tokens_used_month),
          limit: toNumber(budget.monthly_token_limit),
          unavailable: false,
        }))
        .catch((error) => {
          this.#markUnavailable(error);
          return this.#fallbackUsage();
        })
        .finally(() => {
          this.#usageRequest = null;
        });
    }
    return this.#usageRequest;
  }

  getWorkspace() {
    return Promise.resolve({
      prompts: [],
      context: [],
      attention: [],
      topics: [],
      transcript: emptyAiTranscript(),
    });
  }

  async sendMessage() {
    throw clientContractError(
      'ai/requests/',
      'The supplied API exposes audited AI jobs, not a chat-conversation endpoint. Add a server chat endpoint before enabling chat messages.',
    );
  }

  async clearMessages() {
    throw clientContractError(
      'ai/requests/',
      'AI request history is append-only in the supplied API.',
    );
  }
}

export class HttpPrintRepository extends IPrintRepository {
  async listPrinters() {
    return asList(await httpClient.get('printing/printers/?page_size=100')).map(mapPrinter);
  }

  async listJobs() {
    return asList(await httpClient.get('printing/jobs/?page_size=100')).map(mapPrintJob);
  }

  getLibrary() {
    return Promise.resolve({ fileCount: 0 });
  }

  async createJob() {
    throw clientContractError(
      'printing/jobs/',
      'A print job needs a tenant S3 payload key, branch, source, source ID, and page count. The quick-print form must complete the signed-upload flow first.',
    );
  }

  async cancelJob() {
    throw clientContractError(
      'printing/jobs/{id}/',
      'The supplied API has no staff-side cancel-print-job endpoint.',
    );
  }
}

export class HttpSurveyRepository extends ISurveyRepository {
  async listActive() {
    const forms = asList(await httpClient.get('forms/?status=published&page_size=100'));
    return forms.map(mapForm);
  }

  listHistory() {
    // The contract has no endpoint for a respondent's form history. Returning an
    // honest empty state is safer than displaying another user's responses.
    return Promise.resolve([]);
  }

  async submit() {
    throw clientContractError(
      'forms/{id}/submit/',
      'Forms have dynamic fields. The current fixed rating/comment modal must be replaced with a renderer for form_fields before submission is enabled.',
    );
  }

  async skip() {
    throw clientContractError(
      'forms/{id}/',
      'The supplied forms API does not support skipping a form.',
    );
  }
}

export class HttpMgmtRepository extends IMgmtRepository {
  #currentUserId = null;

  async #getCurrentUserId() {
    if (this.#currentUserId == null) {
      const user = await httpClient.get('users/me/');
      this.#currentUserId = user.id;
    }
    return this.#currentUserId;
  }

  async listThreads() {
    return asList(await httpClient.get('messaging/threads/?page_size=100')).map(mapThread);
  }

  async getTranscript(threadId) {
    const [messages, currentUserId] = await Promise.all([
      httpClient.get(`messaging/threads/${threadId}/messages/?page_size=100`),
      this.#getCurrentUserId(),
    ]);
    return asList(messages).map((message) => mapMessage(message, currentUserId));
  }

  async sendMessage(threadId, text) {
    const currentUserId = await this.#getCurrentUserId();
    return mapMessage(
      await httpClient.post(`messaging/threads/${threadId}/messages/`, { body: text }),
      currentUserId,
    );
  }

  async createThread() {
    throw clientContractError(
      'messaging/threads/',
      'Starting a message requires selected numeric participant IDs. The current free-text recipient form must be connected to the user directory first.',
    );
  }

  markRead(threadId) {
    return httpClient.post(`messaging/threads/${threadId}/read/`, {});
  }
}

export class HttpNotificationRepository extends INotificationRepository {
  #listRequest = null;

  async #list() {
    if (!this.#listRequest) {
      this.#listRequest = httpClient
        .get('notifications/?page_size=100')
        .then(asList)
        .finally(() => {
          this.#listRequest = null;
        });
    }
    return this.#listRequest;
  }

  async listGroups() {
    return notificationGroups(await this.#list());
  }

  async listFilters() {
    return notificationFilters(await this.#list());
  }

  markRead(id) {
    return httpClient.post(`notifications/${id}/read/`, {});
  }

  markAllRead() {
    return httpClient.post('notifications/read-all/', {});
  }
}

export class HttpMaterialRepository extends IMaterialRepository {
  #filesRequest = null;

  async #files() {
    if (!this.#filesRequest) {
      this.#filesRequest = httpClient
        .get('content/files/?page_size=100')
        .then(asList)
        .finally(() => {
          this.#filesRequest = null;
        });
    }
    return this.#filesRequest;
  }

  async list() {
    return (await this.#files()).map(mapMaterial);
  }

  async getStats() {
    const files = await this.#files();
    const count = (kind) => files.filter((file) => materialKind(file.content_type) === kind).length;
    return [
      { value: String(count('pdf')), label: 'PDF', color: 'var(--sf-danger)' },
      { value: String(count('video')), label: 'Video', color: 'var(--sf-primary)' },
      { value: String(count('doc')), label: 'Documents', color: 'var(--sf-accent)' },
    ];
  }

  async getStorage() {
    const files = await this.#files();
    const bytes = files.reduce((sum, file) => sum + toNumber(file.size_bytes), 0);
    return { used: bytesLabel(bytes), total: '—', fileCount: files.length };
  }

  async create() {
    throw clientContractError(
      'content/upload-url/',
      'Material upload must use the signed-upload workflow and choose a lesson or folder before it can be created.',
    );
  }

  async remove() {
    throw clientContractError(
      'content/files/{id}/',
      'The supplied API does not expose file deletion from this screen.',
    );
  }
}

/** Navigation badge counts, assembled from the endpoint-specific live sources. */
export class HttpNavigationRepository {
  async getBadges() {
    const [unread, tasks, forms, threads] = await Promise.all([
      httpClient.get('notifications/unread-count/'),
      optional(() => httpClient.get('tasks/mine/?page_size=100'), []),
      optional(() => httpClient.get('forms/?status=published&page_size=100'), []),
      optional(() => httpClient.get('messaging/threads/?page_size=100'), []),
    ]);
    return {
      notif: toNumber(unread?.count),
      tasks: asList(tasks).filter((task) => task.status !== 'done' && task.status !== 'cancelled')
        .length,
      surveys: asList(forms).length,
      mgmt: asList(threads).reduce((sum, thread) => sum + toNumber(thread.unread_count), 0),
    };
  }
}
