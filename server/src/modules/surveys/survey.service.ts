import type { AuthContext } from '../../http/plugins/auth';
import { NotFoundError } from '../../shared/errors';
import type { SurveyRepository } from './survey.repository';
import { mapActiveSurvey, mapHistorySurvey } from './survey.mapper';
import type { SubmitSurveyInput } from './survey.schemas';

/**
 * Survey read use-cases. Active vs. history is decided per-teacher: a survey is
 * history once this teacher has a *final* (submitted | skipped) response, else
 * it is active (progress sourced from any in-progress draft). Both lists are
 * built from two set-based queries — no per-survey round-trips.
 */
export class SurveyService {
  constructor(private readonly repo: SurveyRepository) {}

  /** Surveys this teacher has not yet finalised. `remaining`/`progress` derived. */
  async listActive(ctx: AuthContext) {
    const [surveys, finalResponses, drafts] = await Promise.all([
      this.repo.listSurveys(ctx.academyId),
      this.repo.finalResponsesByTeacher(ctx.academyId, ctx.teacherId),
      this.repo.draftProgressByTeacher(ctx.academyId, ctx.teacherId),
    ]);
    const now = new Date();
    return surveys
      .filter((s) => !finalResponses.has(s.id))
      .map((s) => mapActiveSurvey(s, drafts.get(s.id) ?? 0, now));
  }

  /** Surveys this teacher has finalised, newest finalisation first. */
  async listHistory(ctx: AuthContext) {
    const [surveys, finalResponses] = await Promise.all([
      this.repo.listSurveys(ctx.academyId),
      this.repo.finalResponsesByTeacher(ctx.academyId, ctx.teacherId),
    ]);
    const byId = new Map(surveys.map((s) => [s.id, s]));
    // finalResponses is already ordered newest-first; preserve that order.
    const out = [];
    for (const [surveyId, response] of finalResponses) {
      const survey = byId.get(surveyId);
      if (survey) out.push(mapHistorySurvey(survey, response));
    }
    return out;
  }

  /**
   * Finalise a survey for this teacher as *submitted*. Idempotent: re-submitting
   * overwrites the same (surveyId, teacherId) row, never duplicating. The survey
   * must belong to the tenant (404 otherwise). Returns the history DTO so the
   * frontend can move the survey from the active list into history in one step.
   */
  async submit(ctx: AuthContext, surveyId: string, input: SubmitSurveyInput) {
    const survey = await this.repo.getSurvey(surveyId, ctx.academyId);
    if (!survey) throw new NotFoundError('Survey');
    const response = await this.repo.upsertResponse(surveyId, ctx.teacherId, {
      status: 'submitted',
      rating: input.rating,
      comment: input.comment ?? null,
    });
    return mapHistorySurvey(survey, response);
  }

  /**
   * Finalise a survey for this teacher as *skipped*. Idempotent and tenant-scoped
   * exactly like {@link submit}; carries no rating/comment.
   */
  async skip(ctx: AuthContext, surveyId: string) {
    const survey = await this.repo.getSurvey(surveyId, ctx.academyId);
    if (!survey) throw new NotFoundError('Survey');
    const response = await this.repo.upsertResponse(surveyId, ctx.teacherId, {
      status: 'skipped',
      rating: null,
      comment: null,
    });
    return mapHistorySurvey(survey, response);
  }
}
