export class MgmtService {
  /** @param {{ mgmtRepo: import('@/data/repositories/interfaces.js').IMgmtRepository }} deps */
  constructor({ mgmtRepo }) {
    this.mgmtRepo = mgmtRepo;
  }
  getThreads() {
    return this.mgmtRepo.listThreads();
  }
  getTranscript(threadId) {
    return this.mgmtRepo.getTranscript(threadId);
  }
}
