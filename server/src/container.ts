import type { AppConfig } from './config/env';
import type { Db } from './db/prisma';

import { AuthRepository } from './modules/auth/auth.repository';
import { SessionRepository } from './modules/auth/session.repository';
import { AuthService } from './modules/auth/auth.service';
import { AccountRepository } from './modules/account/account.repository';
import { AccountService } from './modules/account/account.service';
import { CohortRepository } from './modules/cohorts/cohort.repository';
import { CohortService } from './modules/cohorts/cohort.service';
import { CardsRepository } from './modules/cards/cards.repository';
import { CardsService } from './modules/cards/cards.service';
import { TaskRepository } from './modules/tasks/task.repository';
import { TaskService } from './modules/tasks/task.service';
import { AiRepository } from './modules/ai/ai.repository';
import { AiService } from './modules/ai/ai.service';
import { PrintRepository } from './modules/print/print.repository';
import { PrintService } from './modules/print/print.service';
import { SurveyRepository } from './modules/surveys/survey.repository';
import { SurveyService } from './modules/surveys/survey.service';
import { MgmtRepository } from './modules/mgmt/mgmt.repository';
import { MgmtService } from './modules/mgmt/mgmt.service';
import { NotificationRepository } from './modules/notifications/notification.repository';
import { NotificationService } from './modules/notifications/notification.service';
import { MaterialRepository } from './modules/materials/material.repository';
import { MaterialService } from './modules/materials/material.service';
import { DashboardRepository } from './modules/dashboard/dashboard.repository';
import { DashboardService } from './modules/dashboard/dashboard.service';
import { NavigationRepository } from './modules/navigation/navigation.repository';
import { NavigationService } from './modules/navigation/navigation.service';

/**
 * The application service registry. The HTTP layer depends only on these
 * use-case services, never on repositories or Prisma directly.
 */
export interface Services {
  auth: AuthService;
  account: AccountService;
  cohorts: CohortService;
  cards: CardsService;
  tasks: TaskService;
  ai: AiService;
  print: PrintService;
  surveys: SurveyService;
  mgmt: MgmtService;
  notifications: NotificationService;
  materials: MaterialService;
  dashboard: DashboardService;
  navigation: NavigationService;
}

export interface Container {
  config: AppConfig;
  db: Db;
  services: Services;
}

/**
 * Composition root — the single place that constructs concrete repositories and
 * wires them into services. Swapping a data source or faking a repo in tests is
 * a change here and nowhere else (DIP).
 */
export function createContainer(config: AppConfig, db: Db): Container {
  // Repositories
  const sessionRepo = new SessionRepository(db);
  const authRepo = new AuthRepository(db);
  const accountRepo = new AccountRepository(db);
  const cohortRepo = new CohortRepository(db);
  const cardsRepo = new CardsRepository(db);
  const taskRepo = new TaskRepository(db);
  const aiRepo = new AiRepository(db);
  const printRepo = new PrintRepository(db);
  const surveyRepo = new SurveyRepository(db);
  const mgmtRepo = new MgmtRepository(db);
  const notificationRepo = new NotificationRepository(db);
  const materialRepo = new MaterialRepository(db);
  const dashboardRepo = new DashboardRepository(db);
  const navigationRepo = new NavigationRepository(db);

  // Domain services
  const account = new AccountService(accountRepo, sessionRepo);
  const cohorts = new CohortService(cohortRepo);
  const cards = new CardsService(cardsRepo);
  const tasks = new TaskService(taskRepo);
  const surveys = new SurveyService(surveyRepo);
  const print = new PrintService(printRepo);
  const mgmt = new MgmtService(mgmtRepo);

  // Composite read-models depend on the domain services above.
  const dashboard = new DashboardService({
    repo: dashboardRepo,
    cohorts,
    cards,
    tasks,
    surveys,
    print,
    mgmt,
    account,
  });

  const services: Services = {
    auth: new AuthService(authRepo, sessionRepo),
    account,
    cohorts,
    cards,
    tasks,
    ai: new AiService(aiRepo),
    print,
    surveys,
    mgmt,
    notifications: new NotificationService(notificationRepo),
    materials: new MaterialService(materialRepo),
    dashboard,
    navigation: new NavigationService(navigationRepo),
  };

  return { config, db, services };
}
