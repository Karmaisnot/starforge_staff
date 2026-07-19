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
} from '../interfaces.js';

import { teacherFixture } from '@/data/fixtures/teacher.js';
import { cohortsFixture, rosterFixture } from '@/data/fixtures/cohorts.js';
import { recentCardsFixture, cardTypesFixture, cardStatsFixture } from '@/data/fixtures/cards.js';
import { tasksFixture, taskColumnsFixture, taskFiltersFixture } from '@/data/fixtures/tasks.js';
import {
  todayMetaFixture,
  surveyBannerFixture,
  todayStatsFixture,
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
    return respond(this.#teacher);
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
    return respond({
      meta: todayMetaFixture,
      surveyBanner: surveyBannerFixture,
      stats: todayStatsFixture,
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
