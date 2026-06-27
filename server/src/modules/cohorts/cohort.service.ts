import { BusinessRuleError, NotFoundError } from '../../shared/errors';
import type { AuthContext } from '../../http/plugins/auth';
import type { CohortRepository, Localized } from './cohort.repository';
import { mapCohort, mapStudent } from './cohort.mapper';
import type { CreateCohortInput, TakeAttendanceInput } from './cohort.schemas';

/** Default localized placeholder for missing display strings (UI parity). */
const DASH: Localized = { uz: '—', ru: '—', en: '—' };
const DEFAULT_COLOR = 'var(--sf-primary)';

/** Mirror a plain (already-localized) display string into every locale leaf. */
function asLocalized(value: string | undefined, fallback: Localized): Localized {
  const v = value?.trim();
  if (!v || v === '—') return fallback;
  return { uz: v, ru: v, en: v };
}

/** Cohort read + write use-cases with computed roster/attendance metrics. */
export class CohortService {
  constructor(private readonly repo: CohortRepository) {}

  async list(ctx: AuthContext) {
    const cohorts = await this.repo.listForTeacher(ctx.academyId, ctx.teacherId);
    const ids = cohorts.map((c) => c.id);
    const [studentCounts, cardCounts, attendance] = await Promise.all([
      this.repo.studentCountByCohort(ids),
      this.repo.cardCountByCohort(ids),
      this.repo.latestAttendanceByCohort(ids),
    ]);
    return cohorts.map((c) =>
      mapCohort(c, {
        studentCount: studentCounts.get(c.id) ?? 0,
        attendance: attendance.get(c.id) ?? 0,
        up: cardCounts.get(c.id)?.up ?? 0,
        down: cardCounts.get(c.id)?.down ?? 0,
      }),
    );
  }

  async getById(ctx: AuthContext, id: string) {
    const cohort = await this.repo.getById(id, ctx.academyId);
    if (!cohort) return null; // parity with mock getById (returns null)
    const [studentCounts, cardCounts, attendance] = await Promise.all([
      this.repo.studentCountByCohort([id]),
      this.repo.cardCountByCohort([id]),
      this.repo.latestAttendanceByCohort([id]),
    ]);
    return mapCohort(cohort, {
      studentCount: studentCounts.get(id) ?? 0,
      attendance: attendance.get(id) ?? 0,
      up: cardCounts.get(id)?.up ?? 0,
      down: cardCounts.get(id)?.down ?? 0,
    });
  }

  /**
   * Create a cohort for the caller's tenant. A supplied `subjectId` is resolved
   * within the academy (ignored if it does not belong to the tenant). Computed
   * metrics are all 0 since the cohort starts with an empty roster.
   */
  async create(ctx: AuthContext, input: CreateCohortInput) {
    let subjectId: string | null = null;
    let subjectLabel: Localized = DASH;
    if (input.subjectId) {
      const subject = await this.repo.getSubject(input.subjectId, ctx.academyId);
      if (subject) {
        subjectId = subject.id;
        subjectLabel = subject.name as Localized;
      }
    }
    const cohort = await this.repo.create({
      academyId: ctx.academyId,
      teacherId: ctx.teacherId,
      subjectId,
      name: input.name,
      level: asLocalized(input.level, DASH),
      subjectLabel,
      room: asLocalized(input.room, DASH),
      color: input.color?.trim() || DEFAULT_COLOR,
      lessonsPerWeek: input.lessonsPerWeek ?? 0,
    });
    return mapCohort(cohort, { studentCount: 0, attendance: 0, up: 0, down: 0 });
  }

  /**
   * Record an attendance take for a cohort. The cohort must belong to the
   * tenant (404 otherwise) and at least one entry is required (422 otherwise).
   * Entries whose student is no longer on the roster (removed mid-take) are
   * skipped rather than failing the whole save, keeping the write race-safe.
   * The persisted summary is derived from the surviving entries.
   */
  async takeAttendance(ctx: AuthContext, cohortId: string, input: TakeAttendanceInput) {
    const cohort = await this.repo.getById(cohortId, ctx.academyId);
    if (!cohort) throw new NotFoundError('Cohort');
    if (input.entries.length === 0) {
      throw new BusinessRuleError('Attendance requires at least one student');
    }

    const rosterIds = await this.repo.studentIdsInCohort(cohortId, ctx.academyId);
    // Keep only entries whose student still belongs to the cohort; dedupe by id
    // (last write wins) so a duplicated studentId cannot break the unique index.
    const surviving = new Map<string, boolean>();
    for (const e of input.entries) {
      if (rosterIds.has(e.studentId)) surviving.set(e.studentId, e.present);
    }
    if (surviving.size === 0) {
      throw new BusinessRuleError('No entries match the current roster');
    }

    const entries = [...surviving].map(([studentId, present]) => ({ studentId, present }));
    const total = entries.length;
    const present = entries.filter((e) => e.present).length;
    const percent = total ? Math.round((present / total) * 100) : 0;

    await this.repo.createAttendance({
      academyId: ctx.academyId,
      cohortId,
      takenById: ctx.teacherId,
      present,
      total,
      percent,
      entries,
    });
    return { present, total, percent };
  }

  async getRoster(ctx: AuthContext, cohortId: string) {
    const students = await this.repo.getStudents(cohortId, ctx.academyId);
    const ids = students.map((s) => s.id);
    const [cardCounts, attendance] = await Promise.all([
      this.repo.cardCountByStudent(ids),
      this.repo.attendanceByStudent(ids),
    ]);
    return students.map((s) =>
      mapStudent(s, {
        up: cardCounts.get(s.id)?.up ?? 0,
        down: cardCounts.get(s.id)?.down ?? 0,
        attendance: attendance.get(s.id) ?? 0,
      }),
    );
  }
}
