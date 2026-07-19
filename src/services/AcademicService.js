export class AcademicService {
  /** @param {{ academicRepo: import('@/data/repositories/interfaces.js').IAcademicRepository }} deps */
  constructor({ academicRepo }) {
    this.academicRepo = academicRepo;
  }

  getWorkspace() {
    return this.academicRepo.getWorkspace();
  }

  publishAssignment(assignmentId) {
    return this.academicRepo.publishAssignment(assignmentId);
  }

  publishExam(examId) {
    return this.academicRepo.publishExam(examId);
  }

  runReport(reportKey, format) {
    return this.academicRepo.runReport(reportKey, format);
  }
}
