// HTTP adapters — the real-backend implementations of the repository ports.
// Each mirrors its Mock* sibling's contract; the only difference is the data
// comes from the Fastify API (via httpClient, which localizes {uz,ru,en} leaves
// just like the mock's deepLocalize). Selected in the composition root when
// VITE_USE_MOCK=false.
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

export class HttpAccountRepository extends IAccountRepository {
  getTeacher() {
    return httpClient.get('/api/account/teacher');
  }
  updateTeacher(patch) {
    return httpClient.patch('/api/account/teacher', patch);
  }
  getSettings() {
    return httpClient.get('/api/account/settings');
  }
  patchSettings(patch) {
    return httpClient.patch('/api/account/settings', patch);
  }
  listSessions() {
    return httpClient.get('/api/account/sessions');
  }
  ejectSession(id) {
    return httpClient.delete(`/api/account/sessions/${id}`);
  }
}

export class HttpCohortRepository extends ICohortRepository {
  list() {
    return httpClient.get('/api/cohorts');
  }
  getById(id) {
    return httpClient.get(`/api/cohorts/${id}`);
  }
  getRoster(cohortId) {
    return httpClient.get(`/api/cohorts/${cohortId}/roster`);
  }
  create(draft) {
    return httpClient.post('/api/cohorts', draft);
  }
  saveAttendance(cohortId, entries) {
    return httpClient.post(`/api/cohorts/${cohortId}/attendance`, { entries });
  }
}

export class HttpCardRepository extends ICardRepository {
  listRecent() {
    return httpClient.get('/api/cards/recent');
  }
  listTypes() {
    return httpClient.get('/api/cards/types');
  }
  getStats() {
    return httpClient.get('/api/cards/stats');
  }
  issue(input) {
    return httpClient.post('/api/cards', input);
  }
}

export class HttpTaskRepository extends ITaskRepository {
  list() {
    return httpClient.get('/api/tasks');
  }
  listColumns() {
    return httpClient.get('/api/tasks/columns');
  }
  listFilters() {
    return httpClient.get('/api/tasks/filters');
  }
  setState(id, state) {
    return httpClient.patch(`/api/tasks/${id}/state`, { state });
  }
  create(draft) {
    return httpClient.post('/api/tasks', draft);
  }
}

export class HttpDashboardRepository extends IDashboardRepository {
  getToday() {
    return httpClient.get('/api/today');
  }
}

export class HttpAiRepository extends IAiRepository {
  listConversations() {
    return httpClient.get('/api/ai/conversations');
  }
  getUsage() {
    return httpClient.get('/api/ai/usage');
  }
  getWorkspace() {
    return httpClient.get('/api/ai/workspace');
  }
  sendMessage(conversationId, text) {
    return httpClient.post(`/api/ai/conversations/${conversationId}/messages`, { text });
  }
  clearMessages(conversationId) {
    return httpClient.delete(`/api/ai/conversations/${conversationId}/messages`);
  }
}

export class HttpPrintRepository extends IPrintRepository {
  listPrinters() {
    return httpClient.get('/api/print/printers');
  }
  listJobs() {
    return httpClient.get('/api/print/jobs');
  }
  getLibrary() {
    return httpClient.get('/api/print/library');
  }
  createJob(input) {
    return httpClient.post('/api/print/jobs', input);
  }
  cancelJob(id) {
    return httpClient.delete(`/api/print/jobs/${id}`);
  }
}

export class HttpSurveyRepository extends ISurveyRepository {
  listActive() {
    return httpClient.get('/api/surveys/active');
  }
  listHistory() {
    return httpClient.get('/api/surveys/history');
  }
  submit(id, input) {
    return httpClient.post(`/api/surveys/${id}/submit`, input);
  }
  skip(id) {
    return httpClient.post(`/api/surveys/${id}/skip`, {});
  }
}

export class HttpMgmtRepository extends IMgmtRepository {
  listThreads() {
    return httpClient.get('/api/mgmt/threads');
  }
  getTranscript(threadId) {
    return httpClient.get(`/api/mgmt/threads/${threadId}/transcript`);
  }
  sendMessage(threadId, text) {
    return httpClient.post(`/api/mgmt/threads/${threadId}/messages`, { text });
  }
  createThread(input) {
    return httpClient.post('/api/mgmt/threads', input);
  }
  markRead(threadId) {
    return httpClient.patch(`/api/mgmt/threads/${threadId}/read`);
  }
}

export class HttpNotificationRepository extends INotificationRepository {
  listGroups() {
    return httpClient.get('/api/notifications/groups');
  }
  listFilters() {
    return httpClient.get('/api/notifications/filters');
  }
  markRead(id) {
    return httpClient.patch(`/api/notifications/${id}/read`);
  }
  markAllRead() {
    return httpClient.patch('/api/notifications/read-all');
  }
}

export class HttpMaterialRepository extends IMaterialRepository {
  list() {
    return httpClient.get('/api/materials');
  }
  getStats() {
    return httpClient.get('/api/materials/stats');
  }
  getStorage() {
    return httpClient.get('/api/materials/storage');
  }
  create(input) {
    return httpClient.post('/api/materials', input);
  }
  remove(id) {
    return httpClient.delete(`/api/materials/${id}`);
  }
}

/** Navigation badge counts (no port class — service consumes this directly). */
export class HttpNavigationRepository {
  getBadges() {
    return httpClient.get('/api/nav/badges');
  }
}
