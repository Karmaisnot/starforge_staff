export class FinanceService {
  /** @param {{ financeRepo: import('@/data/repositories/interfaces.js').IFinanceRepository }} deps */
  constructor({ financeRepo }) {
    this.financeRepo = financeRepo;
  }
  getWorkspace() {
    return this.financeRepo.getWorkspace();
  }
  collectCash(input) {
    return this.financeRepo.collectCash(input);
  }
}
