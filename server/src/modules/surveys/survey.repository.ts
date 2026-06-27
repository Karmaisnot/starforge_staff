import type { Db } from '../../db/prisma';

/**
 * Survey + response data access. Each query is tenant-scoped (academyId) and,
 * where the data is per-teacher, teacher-scoped. Active/history partitioning is
 * driven by the teacher's *final* responses (submitted | skipped), fetched in a
 * single set-based query — never per-survey loops, so there is no N+1.
 */
export class SurveyRepository {
  constructor(private readonly db: Db) {}

  /** All surveys for the tenant, oldest first (stable display order). */
  listSurveys(academyId: string) {
    return this.db.survey.findMany({
      where: { academyId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * This teacher's *final* responses (submitted | skipped) within the tenant,
   * keyed by surveyId. These are the surveys that belong to history; any survey
   * the teacher has not finalised is still active.
   */
  async finalResponsesByTeacher(academyId: string, teacherId: string) {
    const rows = await this.db.surveyResponse.findMany({
      where: {
        teacherId,
        status: { in: ['submitted', 'skipped'] },
        survey: { academyId },
      },
      orderBy: { submittedAt: 'desc' },
    });
    const out = new Map<string, (typeof rows)[number]>();
    for (const r of rows) out.set(r.surveyId, r);
    return out;
  }

  /**
   * This teacher's in-progress (draft) responses, keyed by surveyId. A draft
   * carries partial `progress` for an active survey without finalising it.
   */
  async draftProgressByTeacher(academyId: string, teacherId: string) {
    const rows = await this.db.surveyResponse.findMany({
      where: {
        teacherId,
        status: 'draft',
        survey: { academyId },
      },
      select: { surveyId: true, progress: true },
    });
    const out = new Map<string, number>();
    for (const r of rows) out.set(r.surveyId, r.progress);
    return out;
  }

  /** A single survey, tenant-scoped. Null when it is not in this academy. */
  getSurvey(id: string, academyId: string) {
    return this.db.survey.findFirst({ where: { id, academyId } });
  }

  /**
   * Idempotently finalise this teacher's response to a survey. The unique
   * (surveyId, teacherId) pair guarantees a re-submit/re-skip updates the same
   * row instead of inserting a duplicate; `submittedAt` is stamped on every
   * write so history orders by the latest finalisation.
   */
  upsertResponse(
    surveyId: string,
    teacherId: string,
    data: { status: 'submitted' | 'skipped'; rating: number | null; comment: string | null },
  ) {
    const now = new Date();
    return this.db.surveyResponse.upsert({
      where: { surveyId_teacherId: { surveyId, teacherId } },
      create: { surveyId, teacherId, ...data, submittedAt: now },
      update: { ...data, submittedAt: now },
    });
  }
}
