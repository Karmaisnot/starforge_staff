// Composition root — the ONLY module that names concrete repositories.
// Flip USE_MOCK (or set VITE_USE_MOCK=false) once real Http* adapters exist.
import {
  MockAccountRepository,
  MockCohortRepository,
  MockCardRepository,
  MockTaskRepository,
  MockDashboardRepository,
  MockAiRepository,
  MockPrintRepository,
  MockSurveyRepository,
  MockMgmtRepository,
  MockNotificationRepository,
  MockMaterialRepository,
} from '@/data/repositories/mock/index.js';

import { AccountService } from './AccountService.js';
import { CohortService } from './CohortService.js';
import { CardService } from './CardService.js';
import { TaskService } from './TaskService.js';
import { DashboardService } from './DashboardService.js';
import { AiService } from './AiService.js';
import { PrintService } from './PrintService.js';
import { SurveyService } from './SurveyService.js';
import { MgmtService } from './MgmtService.js';
import { NotificationService } from './NotificationService.js';
import { MaterialService } from './MaterialService.js';
import { NavigationService } from './NavigationService.js';

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== 'false';

function buildRepositories() {
  if (USE_MOCK) {
    return {
      accountRepo: new MockAccountRepository(),
      cohortRepo: new MockCohortRepository(),
      cardRepo: new MockCardRepository(),
      taskRepo: new MockTaskRepository(),
      dashboardRepo: new MockDashboardRepository(),
      aiRepo: new MockAiRepository(),
      printRepo: new MockPrintRepository(),
      surveyRepo: new MockSurveyRepository(),
      mgmtRepo: new MockMgmtRepository(),
      notificationRepo: new MockNotificationRepository(),
      materialRepo: new MockMaterialRepository(),
    };
  }
  // When a backend lands: return Http* adapters here (e.g. new HttpCohortRepository()).
  throw new Error('HTTP repositories are not wired yet — set VITE_USE_MOCK=true.');
}

/** Build the service registry. Exposed as a factory so tests can inject fakes. */
export function createContainer() {
  const repos = buildRepositories();
  return {
    account: new AccountService(repos),
    cohorts: new CohortService(repos),
    cards: new CardService(repos),
    tasks: new TaskService(repos),
    dashboard: new DashboardService(repos),
    ai: new AiService(repos),
    print: new PrintService(repos),
    surveys: new SurveyService(repos),
    mgmt: new MgmtService(repos),
    notifications: new NotificationService(repos),
    materials: new MaterialService(repos),
    navigation: new NavigationService(),
  };
}

/** Default application-wide service container. */
export const services = createContainer();
