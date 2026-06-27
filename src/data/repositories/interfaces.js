// Repository contracts (ports). Concrete adapters — Mock* and Http* — extend
// these and override every method. UI/services depend ONLY on these abstractions
// (DIP); the composition root is the single place that names a concrete.
import { NotImplementedError } from '@/domain/errors.js';

const ni = (m) => {
  throw new NotImplementedError(m);
};

export class IAccountRepository {
  /** @returns {Promise<import('@/domain/models/teacher.js').Teacher>} */
  getTeacher() {
    return ni('IAccountRepository.getTeacher');
  }
  /** @param {{name?:string, username?:string}} _patch @returns {Promise<object>} */
  updateTeacher(_patch) {
    return ni('IAccountRepository.updateTeacher');
  }
  /** @returns {Promise<object>} per-teacher settings (toggles + theme + locale) */
  getSettings() {
    return ni('IAccountRepository.getSettings');
  }
  /** @param {object} _patch @returns {Promise<object>} */
  patchSettings(_patch) {
    return ni('IAccountRepository.patchSettings');
  }
  /** @returns {Promise<object[]>} active device sessions */
  listSessions() {
    return ni('IAccountRepository.listSessions');
  }
  /** @param {string} _id @returns {Promise<object>} */
  ejectSession(_id) {
    return ni('IAccountRepository.ejectSession');
  }
}

export class ICohortRepository {
  /** @returns {Promise<import('@/domain/models/cohort.js').Cohort[]>} */
  list() {
    return ni('ICohortRepository.list');
  }
  /** @param {string} _id @returns {Promise<import('@/domain/models/cohort.js').Cohort|null>} */
  getById(_id) {
    return ni('ICohortRepository.getById');
  }
  /** @param {string} _cohortId @returns {Promise<import('@/domain/models/student.js').Student[]>} */
  getRoster(_cohortId) {
    return ni('ICohortRepository.getRoster');
  }
  /** @param {object} _draft @returns {Promise<object>} */
  create(_draft) {
    return ni('ICohortRepository.create');
  }
  /** @param {string} _cohortId @param {Array<{studentId:string,present:boolean}>} _entries */
  saveAttendance(_cohortId, _entries) {
    return ni('ICohortRepository.saveAttendance');
  }
}

export class ICardRepository {
  listRecent() {
    return ni('ICardRepository.listRecent');
  }
  listTypes() {
    return ni('ICardRepository.listTypes');
  }
  getStats() {
    return ni('ICardRepository.getStats');
  }
  /** @param {object} _input issue a card @returns {Promise<object>} created card */
  issue(_input) {
    return ni('ICardRepository.issue');
  }
}

export class ITaskRepository {
  list() {
    return ni('ITaskRepository.list');
  }
  listColumns() {
    return ni('ITaskRepository.listColumns');
  }
  listFilters() {
    return ni('ITaskRepository.listFilters');
  }
  /** @param {string|number} _id @param {string} _state */
  setState(_id, _state) {
    return ni('ITaskRepository.setState');
  }
  /** @param {object} _draft @returns {Promise<object>} created task */
  create(_draft) {
    return ni('ITaskRepository.create');
  }
}

export class IDashboardRepository {
  getToday() {
    return ni('IDashboardRepository.getToday');
  }
}

export class IAiRepository {
  listConversations() {
    return ni('IAiRepository.listConversations');
  }
  getUsage() {
    return ni('IAiRepository.getUsage');
  }
  getWorkspace() {
    return ni('IAiRepository.getWorkspace');
  }
  /** @param {string} _conversationId @param {string} _text @returns {Promise<object>} {userMessage,aiMessage,usage} */
  sendMessage(_conversationId, _text) {
    return ni('IAiRepository.sendMessage');
  }
  /** @param {string} _conversationId */
  clearMessages(_conversationId) {
    return ni('IAiRepository.clearMessages');
  }
}

export class IPrintRepository {
  listPrinters() {
    return ni('IPrintRepository.listPrinters');
  }
  listJobs() {
    return ni('IPrintRepository.listJobs');
  }
  getLibrary() {
    return ni('IPrintRepository.getLibrary');
  }
  /** @param {object} _input {printerId,doc,copies?,size?} @returns {Promise<object>} created job */
  createJob(_input) {
    return ni('IPrintRepository.createJob');
  }
  /** @param {string} _id */
  cancelJob(_id) {
    return ni('IPrintRepository.cancelJob');
  }
}

export class ISurveyRepository {
  listActive() {
    return ni('ISurveyRepository.listActive');
  }
  listHistory() {
    return ni('ISurveyRepository.listHistory');
  }
  /** @param {string} _id @param {{rating:number,comment?:string}} _input */
  submit(_id, _input) {
    return ni('ISurveyRepository.submit');
  }
  /** @param {string} _id */
  skip(_id) {
    return ni('ISurveyRepository.skip');
  }
}

export class IMgmtRepository {
  listThreads() {
    return ni('IMgmtRepository.listThreads');
  }
  /** @param {number|string} _threadId */
  getTranscript(_threadId) {
    return ni('IMgmtRepository.getTranscript');
  }
  /** @param {number|string} _threadId @param {string} _text @returns {Promise<object>} created message */
  sendMessage(_threadId, _text) {
    return ni('IMgmtRepository.sendMessage');
  }
  /** @param {{name:string,message:string}} _input @returns {Promise<object>} created thread */
  createThread(_input) {
    return ni('IMgmtRepository.createThread');
  }
  /** @param {number|string} _threadId */
  markRead(_threadId) {
    return ni('IMgmtRepository.markRead');
  }
}

export class INotificationRepository {
  listGroups() {
    return ni('INotificationRepository.listGroups');
  }
  listFilters() {
    return ni('INotificationRepository.listFilters');
  }
  /** @param {string} _id */
  markRead(_id) {
    return ni('INotificationRepository.markRead');
  }
  markAllRead() {
    return ni('INotificationRepository.markAllRead');
  }
}

export class IMaterialRepository {
  list() {
    return ni('IMaterialRepository.list');
  }
  getStats() {
    return ni('IMaterialRepository.getStats');
  }
  getStorage() {
    return ni('IMaterialRepository.getStorage');
  }
  /** @param {object} _input {title,kind,sizeBytes?,meta?} @returns {Promise<object>} created material */
  create(_input) {
    return ni('IMaterialRepository.create');
  }
  /** @param {string} _id */
  remove(_id) {
    return ni('IMaterialRepository.remove');
  }
}
