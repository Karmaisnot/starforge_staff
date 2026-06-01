// Repository contracts (ports). Concrete adapters — Mock* (now) and Http* (later)
// — extend these and override every method. UI/services depend ONLY on these
// abstractions (DIP); the composition root is the single place that names a concrete.
import { NotImplementedError } from '@/domain/errors.js';

const ni = (m) => {
  throw new NotImplementedError(m);
};

export class IAccountRepository {
  /** @returns {Promise<import('@/domain/models/teacher.js').Teacher>} */
  getTeacher() {
    return ni('IAccountRepository.getTeacher');
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
  /** @param {number} _id @param {string} _state */
  setState(_id, _state) {
    return ni('ITaskRepository.setState');
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
}

export class ISurveyRepository {
  listActive() {
    return ni('ISurveyRepository.listActive');
  }
  listHistory() {
    return ni('ISurveyRepository.listHistory');
  }
}

export class IMgmtRepository {
  listThreads() {
    return ni('IMgmtRepository.listThreads');
  }
  /** @param {number} _threadId */
  getTranscript(_threadId) {
    return ni('IMgmtRepository.getTranscript');
  }
}

export class INotificationRepository {
  listGroups() {
    return ni('INotificationRepository.listGroups');
  }
  listFilters() {
    return ni('INotificationRepository.listFilters');
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
}
