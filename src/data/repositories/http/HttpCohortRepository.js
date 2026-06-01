// Example HTTP adapter — proves the swap path. When a backend exists, implement
// the rest of the Http* repositories the same way and flip USE_MOCK in the container.
import { ICohortRepository } from '../interfaces.js';
import { httpClient } from '@/data/http/httpClient.js';

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
}
