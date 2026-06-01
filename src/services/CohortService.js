export class CohortService {
  /** @param {{ cohortRepo: import('@/data/repositories/interfaces.js').ICohortRepository }} deps */
  constructor({ cohortRepo }) {
    this.cohortRepo = cohortRepo;
  }
  list() {
    return this.cohortRepo.list();
  }
  getById(id) {
    return this.cohortRepo.getById(id);
  }
  getRoster(cohortId) {
    return this.cohortRepo.getRoster(cohortId);
  }
}
