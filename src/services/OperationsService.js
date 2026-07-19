export class OperationsService {
  /** @param {{ operationsRepo: import('@/data/repositories/interfaces.js').IOperationsRepository }} deps */
  constructor({ operationsRepo }) {
    this.operationsRepo = operationsRepo;
  }

  getWorkspace() {
    return this.operationsRepo.getWorkspace();
  }

  acknowledgeRule(ruleId) {
    return this.operationsRepo.acknowledgeRule(ruleId);
  }
}
