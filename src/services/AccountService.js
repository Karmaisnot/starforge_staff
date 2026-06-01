export class AccountService {
  /** @param {{ accountRepo: import('@/data/repositories/interfaces.js').IAccountRepository }} deps */
  constructor({ accountRepo }) {
    this.accountRepo = accountRepo;
  }
  getTeacher() {
    return this.accountRepo.getTeacher();
  }
}
