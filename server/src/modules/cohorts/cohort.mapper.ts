import type { Cohort, Student } from '@prisma/client';

export interface CohortMetrics {
  studentCount: number;
  attendance: number;
  up: number;
  down: number;
}

export interface StudentMetrics {
  up: number;
  down: number;
  attendance: number;
}

/** Cohort DTO — matches cohortsFixture (localized leaves passed through). */
export function mapCohort(cohort: Cohort, metrics: CohortMetrics) {
  return {
    id: cohort.id,
    name: cohort.name,
    level: cohort.level, // localized
    subject: cohort.subjectLabel, // localized
    studentCount: metrics.studentCount,
    attendance: metrics.attendance,
    up: metrics.up,
    down: metrics.down,
    next: cohort.nextLabel, // localized
    color: cohort.color,
    room: cohort.room, // localized
  };
}

/** Student DTO — matches rosterFixture entries. */
export function mapStudent(student: Student, metrics: StudentMetrics) {
  return {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    up: metrics.up,
    down: metrics.down,
    attendance: metrics.attendance,
    flag: student.flag, // 'top' | 'warn' | null
  };
}
