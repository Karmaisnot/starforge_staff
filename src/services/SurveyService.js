export class SurveyService {
  /** @param {{ surveyRepo: import('@/data/repositories/interfaces.js').ISurveyRepository }} deps */
  constructor({ surveyRepo }) {
    this.surveyRepo = surveyRepo;
  }
  getActive() {
    return this.surveyRepo.listActive();
  }
  getHistory() {
    return this.surveyRepo.listHistory();
  }
}
