export class PrintService {
  /** @param {{ printRepo: import('@/data/repositories/interfaces.js').IPrintRepository }} deps */
  constructor({ printRepo }) {
    this.printRepo = printRepo;
  }
  getPrinters() {
    return this.printRepo.listPrinters();
  }
  getJobs() {
    return this.printRepo.listJobs();
  }
  getLibrary() {
    return this.printRepo.getLibrary();
  }
}
