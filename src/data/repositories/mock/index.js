// In-memory adapters. Each honours its interface and serves cloned fixtures
// behind simulated latency, so swapping in an Http* adapter changes nothing upstream.
// Fixtures may carry {uz,ru,en} leaves; `respond` resolves them to the active locale.
import { respond as rawRespond } from '@/data/async.js';
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
  getTeacher() {
    return respond(teacherFixture);
  }
}

export class MockCohortRepository extends ICohortRepository {
  list() {
    return respond(cohortsFixture);
  }
  getById(id) {
    return respond(cohortsFixture.find((c) => c.id === id) ?? null);
  }
  getRoster(cohortId) {
    return respond(rosterFixture[cohortId] ?? []);
  }
}

export class MockCardRepository extends ICardRepository {
  listRecent() {
    return respond(recentCardsFixture);
  }
  listTypes() {
    return respond(cardTypesFixture);
  }
  getStats() {
    return respond(cardStatsFixture);
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
  listConversations() {
    return respond(aiConversationsFixture);
  }
  getUsage() {
    return respond(aiUsageFixture);
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
}

export class MockPrintRepository extends IPrintRepository {
  listPrinters() {
    return respond(printersFixture);
  }
  listJobs() {
    return respond(printJobsFixture);
  }
  getLibrary() {
    return respond(printLibraryFixture);
  }
}

export class MockSurveyRepository extends ISurveyRepository {
  listActive() {
    return respond(activeSurveysFixture);
  }
  listHistory() {
    return respond(surveyHistoryFixture);
  }
}

export class MockMgmtRepository extends IMgmtRepository {
  listThreads() {
    return respond(mgmtThreadsFixture);
  }
  getTranscript(threadId) {
    return respond(mgmtTranscriptFixture[threadId] ?? []);
  }
}

export class MockNotificationRepository extends INotificationRepository {
  listGroups() {
    return respond(notificationGroupsFixture);
  }
  listFilters() {
    return respond(notificationFiltersFixture);
  }
}

export class MockMaterialRepository extends IMaterialRepository {
  list() {
    return respond(materialsFixture);
  }
  getStats() {
    return respond(materialStatsFixture);
  }
  getStorage() {
    return respond(materialStorageFixture);
  }
}
