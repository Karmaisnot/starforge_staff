export class AccountService {
  /** @param {{ accountRepo: import('@/data/repositories/interfaces.js').IAccountRepository }} deps */
  constructor({ accountRepo }) {
    this.accountRepo = accountRepo;
  }
  getTeacher() {
    return this.accountRepo.getTeacher();
  }
  /** Persist profile edits; resolves to the refreshed teacher record. */
  updateTeacher(patch) {
    return this.accountRepo.updateTeacher(patch);
  }
  /** Load the per-teacher settings (toggles + theme + locale). */
  getSettings() {
    return this.accountRepo.getSettings();
  }
  /** Persist a single changed setting field; resolves to the full settings. */
  patchSettings(patch) {
    return this.accountRepo.patchSettings(patch);
  }
  /** List active device sessions for the Devices card. */
  listSessions() {
    return this.accountRepo.listSessions();
  }
  /** Revoke one device session. */
  ejectSession(id) {
    return this.accountRepo.ejectSession(id);
  }
}
