export class MaterialService {
  /** @param {{ materialRepo: import('@/data/repositories/interfaces.js').IMaterialRepository }} deps */
  constructor({ materialRepo }) {
    this.materialRepo = materialRepo;
  }
  getList() {
    return this.materialRepo.list();
  }
  getStats() {
    return this.materialRepo.getStats();
  }
  getStorage() {
    return this.materialRepo.getStorage();
  }
}
