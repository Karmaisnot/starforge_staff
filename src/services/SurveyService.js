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
  /** @param {string} surveyId @param {{rating:number,comment?:string}} input */
  submit(surveyId, input) {
    return this.surveyRepo.submit(surveyId, input);
  }
  /** @param {string} surveyId */
  skip(surveyId) {
    return this.surveyRepo.skip(surveyId);
  }
}
