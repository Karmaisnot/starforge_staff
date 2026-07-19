// In-memory adapters. Each honours its interface and serves cloned fixtures
// behind simulated latency, so swapping in an Http* adapter changes nothing upstream.
// Fixtures may carry {uz,ru,en} leaves; `respond` resolves them to the active locale.
import { clone, respond as rawRespond } from '@/data/async.js';
import { deepLocalize, getLocale } from '@/i18n/locale.js';

const respond = (value) => rawRespond(deepLocalize(value, getLocale()));
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
  IWorkRepository,
  IFinanceRepository,
  IPeopleRepository,
  IAcademicRepository,
  IOperationsRepository,
} from '../interfaces.js';

import { teacherFixture } from '@/data/fixtures/teacher.js';
import { peopleFixture } from '@/data/fixtures/people.js';
import { cohortsFixture, rosterFixture } from '@/data/fixtures/cohorts.js';
import { recentCardsFixture, cardTypesFixture, cardStatsFixture } from '@/data/fixtures/cards.js';
import { tasksFixture, taskColumnsFixture, taskFiltersFixture } from '@/data/fixtures/tasks.js';
import {
  todayMetaFixture,
  surveyBannerFixture,
  todayStatsFixture,
  teacherPerformanceFixture,
  heroLessonFixture,
  scheduleFixture,
  aiInsightFixture,
  printQueueFixture,
  mgmtMentionFixture,
  spotlightFixture,
  activityFixture,
  pendingTasksFixture,
} from '@/data/fixtures/dashboard.js';
import {
  aiUsageFixture,
  aiConversationsFixture,
  aiPromptsFixture,
  aiContextFixture,
  aiAttentionFixture,
  aiTopicsFixture,
  aiTranscriptFixture,
} from '@/data/fixtures/ai.js';
import { printersFixture, printJobsFixture, printLibraryFixture } from '@/data/fixtures/print.js';
import { activeSurveysFixture, surveyHistoryFixture } from '@/data/fixtures/surveys.js';
import { mgmtThreadsFixture, mgmtTranscriptFixture } from '@/data/fixtures/mgmt.js';
import {
  notificationGroupsFixture,
  notificationFiltersFixture,
} from '@/data/fixtures/notifications.js';
import {
  materialsFixture,
  materialStatsFixture,
  materialStorageFixture,
} from '@/data/fixtures/materials.js';
import { buildWorkFixture } from '@/data/fixtures/work.js';
import { buildFinanceFixture } from '@/data/fixtures/finance.js';
import { buildAcademicFixture } from '@/data/fixtures/academic.js';
import { operationsFixture } from '@/data/fixtures/operations.js';

export class MockAccountRepository extends IAccountRepository {
  #teacher = clone(teacherFixture);
  #settings = {};
  #sessions = [
    {
      id: 'mock-web-session',
      platform: 'web',
      userAgent: 'StarForge EDU · this browser',
      lastSeenAt: new Date().toISOString(),
    },
  ];

  getTeacher() {
    // Mock mode can emulate another backend role for deterministic access tests.
    // This never affects live mode or real authorization.
    let role = null;
    try {
      role = localStorage.getItem('sf-mock-role');
    } catch {
      role = null;
    }
    const roleNames = {
      teacher: 'Teacher',
      accountant: 'Accountant',
      cashier: 'Cashier',
      librarian: 'Librarian',
      security: 'Security',
      it: 'IT specialist',
      registrar: 'Registrar',
      support: 'Support',
      director: 'Director',
      head_of_dept: 'Head of department',
    };
    const profile = roleNames[role]
      ? { ...this.#teacher, roleKey: role, role: roleNames[role] }
      : this.#teacher;
    return respond(profile);
  }
  updateTeacher(patch) {
    this.#teacher = { ...this.#teacher, ...patch };
    return respond(this.#teacher);
  }
  getSettings() {
    return respond(this.#settings);
  }
  patchSettings(patch) {
    this.#settings = { ...this.#settings, ...patch };
    return respond(this.#settings);
  }
  listSessions() {
    return respond(this.#sessions);
  }
  ejectSession(id) {
    const before = this.#sessions.length;
    this.#sessions = this.#sessions.filter((session) => session.id !== id);
    return respond({ removed: before !== this.#sessions.length });
  }
}

export class MockCohortRepository extends ICohortRepository {
  #cohorts = clone(cohortsFixture);
  #rosters = clone(rosterFixture);

  list() {
    return respond(this.#cohorts);
  }
  getById(id) {
    return respond(this.#cohorts.find((c) => c.id === id) ?? null);
  }
  getRoster(cohortId) {
    return respond(this.#rosters[cohortId] ?? []);
  }
  create(draft) {
    const cohort = {
      id: `group-${Date.now()}`,
      color: 'var(--sf-primary)',
      studentCount: 0,
      attendance: 100,
      up: 0,
      down: 0,
      next: '—',
      subject: '—',
      ...draft,
    };
    this.#cohorts.unshift(cohort);
    this.#rosters[cohort.id] = [];
    return respond(cohort);
  }
  saveAttendance(cohortId, entries) {
    const roster = this.#rosters[cohortId] ?? [];
    const marked = new Map(entries.map((entry) => [String(entry.studentId), entry.present]));
    for (const student of roster) {
      if (marked.has(String(student.id)))
        student.attendance = marked.get(String(student.id)) ? 100 : 0;
    }
    return respond({ cohortId, saved: entries.length });
  }
}

export class MockCardRepository extends ICardRepository {
  #cards = clone(recentCardsFixture);
  #types = clone(cardTypesFixture);

  listRecent() {
    return respond(this.#cards);
  }
  listTypes() {
    return respond(this.#types);
  }
  getStats() {
    const up = this.#cards.filter((card) => card.kind === 'up').length;
    const down = this.#cards.filter((card) => card.kind === 'down').length;
    const recipients = new Set(this.#cards.map((card) => card.recipient)).size;
    return respond({
      ...cardStatsFixture,
      upThisWeek: up,
      downThisWeek: down,
      recipients,
      typeCount: this.#types.length,
    });
  }
  issue(input) {
    const card = {
      id: `card-${Date.now()}`,
      cohort: '',
      issuer: 'N.K.',
      when: 'now',
      ...input,
    };
    this.#cards.unshift(card);
    return respond(card);
  }
  scan(code) {
    return respond({
      scanId: `scan-${Date.now()}`,
      valid: code.trim().toLowerCase() !== 'revoked',
      student: 'Akbarov Akmal',
      cardType: 'Student access',
      scannedAt: new Date().toISOString(),
      attendanceLesson: code.trim().toLowerCase() === 'no-lesson' ? null : 'lesson-1',
    });
  }
}

export class MockTaskRepository extends ITaskRepository {
  #tasks = tasksFixture.map((t) => ({ ...t }));
  list() {
    return respond(this.#tasks);
  }
  listColumns() {
    return respond(taskColumnsFixture);
  }
  listFilters() {
    return respond(taskFiltersFixture);
  }
  setState(id, state) {
    const task = this.#tasks.find((t) => t.id === id);
    if (task) task.state = state;
    return respond(task ?? null);
  }
  create(draft) {
    const nextId = Math.max(0, ...this.#tasks.map((task) => Number(task.id) || 0)) + 1;
    const task = {
      id: nextId,
      state: 'todo',
      priority: 'P2',
      project: '—',
      projectColor: 'var(--sf-primary)',
      deadline: '—',
      urgent: false,
      fromMgmt: false,
      subtasks: null,
      assigner: 'Me',
      mine: true,
      ...draft,
    };
    this.#tasks.unshift(task);
    return respond(task);
  }
}

export class MockDashboardRepository extends IDashboardRepository {
  getToday() {
    const locale = getLocale();
    const code = locale === 'ru' ? 'ru-RU' : locale === 'uz' ? 'uz-UZ' : 'en-US';
    const dateLabel = new Intl.DateTimeFormat(code, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    let role = null;
    try {
      role = localStorage.getItem('sf-mock-role');
    } catch {
      role = null;
    }
    if (role && role !== 'teacher') {
      return respond({
        workspaceMode: 'staff',
        meta: {
          ...todayMetaFixture,
          dateLabel,
          summary: {
            uz: '3 ta ochiq vazifa · 2 ta uchrashuv · 1 ta so‘rov',
            ru: '3 открытые задачи · 2 встречи · 1 запрос',
            en: '3 open tasks · 2 meetings · 1 request',
          },
        },
        surveyBanner: null,
        stats: [
          { value: '3', label: { uz: 'Ochiq vazifalar', ru: 'Открытые задачи', en: 'Open tasks' } },
          { value: '2', label: { uz: 'Uchrashuvlar', ru: 'Встречи', en: 'Meetings' } },
          { value: '1', label: { uz: 'Ochiq so‘rovlar', ru: 'Открытые запросы', en: 'Open requests' } },
          { value: '4', label: { uz: 'O‘qilmagan', ru: 'Непрочитанные', en: 'Unread' } },
        ],
        performance: {},
        heroLesson: { available: false, kind: 'staff', start: '—' },
        schedule: [],
        recentCards: [],
        pendingTasks: pendingTasksFixture,
        aiInsight: null,
        printQueue: [],
        mgmtMention: mgmtMentionFixture,
        spotlight: null,
        activity: [],
      });
    }
    return respond({
      workspaceMode: 'teaching',
      meta: { ...todayMetaFixture, dateLabel },
      surveyBanner: surveyBannerFixture,
      stats: todayStatsFixture,
      performance: teacherPerformanceFixture,
      heroLesson: heroLessonFixture,
      schedule: scheduleFixture,
      recentCards: recentCardsFixture,
      pendingTasks: pendingTasksFixture,
      aiInsight: aiInsightFixture,
      printQueue: printQueueFixture,
      mgmtMention: mgmtMentionFixture,
      spotlight: spotlightFixture,
      activity: activityFixture,
    });
  }
}

export class MockAiRepository extends IAiRepository {
  #usage = clone(aiUsageFixture);

  listConversations() {
    return respond(aiConversationsFixture);
  }
  getUsage() {
    return respond(this.#usage);
  }
  getWorkspace() {
    return respond({
      prompts: aiPromptsFixture,
      context: aiContextFixture,
      attention: aiAttentionFixture,
      topics: aiTopicsFixture,
      transcript: aiTranscriptFixture,
    });
  }
  sendMessage(conversationId, text) {
    const words = String(text ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    this.#usage.used += Math.max(12, words * 8);
    return respond({
      userMessage: { id: `user-${Date.now()}`, conversationId, text },
      aiMessage: {
        id: `ai-${Date.now()}`,
        conversationId,
        text: 'AI is offline right now. Your question is saved for a later response.',
      },
      usage: this.#usage,
    });
  }
  clearMessages(conversationId) {
    return respond({ conversationId, cleared: true });
  }
}

export class MockPrintRepository extends IPrintRepository {
  #jobs = clone(printJobsFixture);

  listPrinters() {
    return respond(printersFixture);
  }
  listJobs() {
    return respond(this.#jobs);
  }
  getLibrary() {
    return respond(printLibraryFixture);
  }
  createJob(input) {
    const job = {
      id: `job-${Date.now()}`,
      state: 'queued',
      progress: 0,
      eta: 'Queued',
      icon: 'doc',
      printer: input.printer ?? 'Printer',
      ...input,
    };
    this.#jobs.unshift(job);
    return respond(job);
  }
  cancelJob(id) {
    const job = this.#jobs.find((candidate) => candidate.id === id) ?? null;
    this.#jobs = this.#jobs.filter((candidate) => candidate.id !== id);
    return respond(job);
  }
}

export class MockSurveyRepository extends ISurveyRepository {
  #active = clone(activeSurveysFixture);
  #history = clone(surveyHistoryFixture);

  listActive() {
    return respond(this.#active);
  }
  listHistory() {
    return respond(this.#history);
  }
  submit(id, input) {
    const survey = this.#active.find((candidate) => candidate.id === id);
    this.#active = this.#active.filter((candidate) => candidate.id !== id);
    if (survey) {
      this.#history.unshift({
        title: survey.title,
        issuer: survey.issuer,
        status: 'Submitted',
        skipped: false,
        date: 'Now',
        rating: input.rating,
        comment: input.comment ?? '',
      });
    }
    return respond({ id, submitted: true });
  }
  skip(id) {
    const survey = this.#active.find((candidate) => candidate.id === id);
    this.#active = this.#active.filter((candidate) => candidate.id !== id);
    if (survey) {
      this.#history.unshift({
        title: survey.title,
        issuer: survey.issuer,
        status: 'Skipped',
        skipped: true,
        date: 'Now',
        rating: null,
        comment: null,
      });
    }
    return respond({ id, skipped: true });
  }
}

export class MockMgmtRepository extends IMgmtRepository {
  #threads = clone(mgmtThreadsFixture);
  #transcripts = clone(mgmtTranscriptFixture);

  listThreads() {
    return respond(this.#threads);
  }
  getTranscript(threadId) {
    return respond(this.#transcripts[threadId] ?? []);
  }
  sendMessage(threadId, text) {
    const message = { id: `message-${Date.now()}`, dir: 'out', text, time: 'now', read: true };
    const key = String(threadId);
    this.#transcripts[key] = [...(this.#transcripts[key] ?? []), message];
    const thread = this.#threads.find((candidate) => String(candidate.id) === key);
    if (thread) {
      thread.lastMessage = text;
      thread.time = 'now';
    }
    return respond(message);
  }
  createThread({ name, message }) {
    const id = Math.max(0, ...this.#threads.map((thread) => Number(thread.id) || 0)) + 1;
    const thread = {
      id,
      name,
      role: 'New conversation',
      lastMessage: message,
      time: 'now',
      unread: 0,
      online: false,
      pinned: false,
      channel: false,
    };
    this.#threads.unshift(thread);
    this.#transcripts[id] = [
      { id: `message-${Date.now()}`, dir: 'out', text: message, time: 'now', read: true },
    ];
    return respond(thread);
  }
  markRead(threadId) {
    const thread = this.#threads.find((candidate) => String(candidate.id) === String(threadId));
    if (thread) thread.unread = 0;
    return respond({ id: threadId, read: true });
  }
}

export class MockNotificationRepository extends INotificationRepository {
  #groups = clone(notificationGroupsFixture).map((group, groupIndex) => ({
    ...group,
    items: group.items.map((item, itemIndex) => ({
      id: `notification-${groupIndex}-${itemIndex}`,
      read: false,
      ...item,
    })),
  }));

  listGroups() {
    return respond(this.#groups);
  }
  listFilters() {
    return respond(notificationFiltersFixture);
  }
  markRead(id) {
    for (const group of this.#groups) {
      const item = group.items.find((candidate) => candidate.id === id);
      if (item) item.read = true;
    }
    return respond({ id, read: true });
  }
  markAllRead() {
    for (const group of this.#groups) {
      for (const item of group.items) item.read = true;
    }
    return respond({ read: true });
  }
}

export class MockMaterialRepository extends IMaterialRepository {
  #materials = clone(materialsFixture);

  list() {
    return respond(this.#materials);
  }
  getStats() {
    return respond(materialStatsFixture);
  }
  getStorage() {
    return respond(materialStorageFixture);
  }
  create(input) {
    const material = {
      id: `material-${Date.now()}`,
      meta: input.meta ?? '—',
      color: 'var(--sf-accent)',
      views: 0,
      date: 'Now',
      aiSummary: false,
      ...input,
    };
    this.#materials.unshift(material);
    return respond(material);
  }
  remove(id) {
    this.#materials = this.#materials.filter((material) => material.id !== id);
    return respond({ id, removed: true });
  }
}

export class MockWorkRepository extends IWorkRepository {
  #workspace = buildWorkFixture();

  getWorkspace() {
    return respond(this.#workspace);
  }
  createRequest(input) {
    const request = {
      id: `request-${Date.now()}`,
      kind: input.kind,
      title: input.title,
      description: input.description ?? '',
      amount: input.amount ?? null,
      outstanding: input.kind === 'loan' ? (input.amount ?? null) : null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.#workspace.requests.unshift(request);
    return respond(request);
  }
  cancelRequest(id) {
    const request = this.#workspace.requests.find(
      (candidate) => String(candidate.id) === String(id),
    );
    if (request) request.status = 'cancelled';
    return respond(request);
  }
  respondMeeting(id, response) {
    const meeting = this.#workspace.meetings.find(
      (candidate) => String(candidate.id) === String(id),
    );
    if (meeting) meeting.response = response;
    return respond(meeting);
  }
  claimCover(id) {
    const cover = this.#workspace.coverage.find((candidate) => String(candidate.id) === String(id));
    if (cover) cover.status = 'assigned';
    return respond(cover);
  }
  requestCover(input) {
    const lesson = this.#workspace.lessons.find(
      (candidate) => String(candidate.id) === String(input.lessonId),
    );
    const cover = {
      id: `cover-${Date.now()}`,
      lessonId: input.lessonId,
      lessonTitle: lesson?.title ?? '',
      time: lesson?.startsAt ?? new Date().toISOString(),
      reason: input.reason ?? '',
      status: 'pending',
      pool: false,
    };
    this.#workspace.coverage.unshift(cover);
    return respond(cover);
  }
}

export class MockFinanceRepository extends IFinanceRepository {
  #workspace = buildFinanceFixture();

  getWorkspace() {
    return respond(this.#workspace);
  }
  collectCash(input) {
    const invoice = this.#workspace.invoices.find(
      (candidate) => String(candidate.id) === String(input.invoiceId),
    );
    if (invoice) {
      invoice.allocated = Math.min(invoice.total, invoice.allocated + Number(input.amount));
      invoice.status = invoice.allocated >= invoice.total ? 'paid' : 'partial';
    }
    const payment = {
      id: `pay-${Date.now()}`,
      provider: 'cash',
      account: invoice?.number ?? String(input.invoiceId),
      amount: Number(input.amount),
      status: 'succeeded',
      paidAt: new Date().toISOString(),
    };
    this.#workspace.payments.unshift(payment);
    return respond(payment);
  }
}

export class MockPeopleRepository extends IPeopleRepository {
  getDirectory() {
    return respond(peopleFixture);
  }
}

export class MockAcademicRepository extends IAcademicRepository {
  #workspace = buildAcademicFixture();

  getWorkspace() {
    return respond(this.#workspace);
  }

  publishAssignment(assignmentId) {
    const assignment = this.#workspace.assignments.find(
      (candidate) => String(candidate.id) === String(assignmentId),
    );
    if (assignment) assignment.status = 'published';
    return respond(assignment);
  }

  publishExam(examId) {
    const exam = this.#workspace.exams.find(
      (candidate) => String(candidate.id) === String(examId),
    );
    if (exam) exam.published = true;
    return respond(exam);
  }

  runReport(reportKey, format = 'pdf') {
    return respond({
      id: `report-run-${Date.now()}`,
      reportKey,
      format,
      status: 'queued',
    });
  }
}

export class MockOperationsRepository extends IOperationsRepository {
  #workspace = clone(operationsFixture);

  getWorkspace() {
    return respond(this.#workspace);
  }

  acknowledgeRule(ruleId) {
    const rule = this.#workspace.rules.find((candidate) => String(candidate.id) === String(ruleId));
    if (rule) rule.acknowledged = true;
    return respond(rule);
  }
}
