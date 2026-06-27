import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';
import { SurveyResponseStatus } from '../../src/domain/enums';

/**
 * Seed surveys for the demo tenant + the demo teacher's responses.
 *
 *  - 2 active surveys (no final response from the teacher):
 *      sv1 — urgent, partially answered (a `draft` response carries progress 33);
 *      sv2 — untouched (progress 0).
 *  - 1 history survey with a `submitted` response (rating + comment).
 *
 * `remaining` / `progress` are NOT stored on these rows — the service derives
 * `remaining` from `deadlineAt` and `progress` from the draft response, so the
 * UI metrics stay computed (no stale literals). Deadlines are pinned relative to
 * "now" so the urgent / multi-day labels render exactly like the fixture.
 *
 * Assumes the survey tables are empty and that the demo academy + teacher rows
 * already exist (does NOT create them).
 */
export async function seedSurveys(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;

  const now = Date.now();
  const hours = (h: number) => new Date(now + h * 3_600_000);
  const daysAgo = (d: number) => new Date(now - d * 24 * 3_600_000);

  // --- Active survey 1: urgent, in-progress -------------------------------
  const sv1 = await db.survey.create({
    data: {
      academyId,
      title: loc(
        'Oylik o‘qituvchi qoniqishi',
        'Ежемесячная удовлетворённость учителя',
        'Monthly teacher satisfaction',
      ),
      issuer: loc('Karimova R. · Direktor', 'Каримова Р. · Директор', 'Karimova R. · Director'),
      questions: 12,
      estimateLabel: loc('~4 daq', '~4 мин', '~4 min'),
      deadlineAt: hours(2 * 24 + 14), // ~2 kun 14 soat
      urgent: true,
      anonymous: false,
    },
  });
  // A draft response keeps sv1 active (not final) while carrying progress 33.
  await db.surveyResponse.create({
    data: {
      surveyId: sv1.id,
      teacherId: teacher.id,
      status: 'draft',
      progress: 33,
    },
  });

  // --- Active survey 2: untouched -----------------------------------------
  await db.survey.create({
    data: {
      academyId,
      title: loc(
        'Karta tizimi · taklif va e‘tirozlar',
        'Система карт · предложения и замечания',
        'Card system · suggestions and objections',
      ),
      issuer: loc('Ahmedov B. · O‘quv ishlari', 'Ахмедов Б. · Учебная часть', 'Ahmedov B. · Academic affairs'),
      questions: 8,
      estimateLabel: loc('~3 daq', '~3 мин', '~3 min'),
      deadlineAt: hours(6 * 24), // ~6 kun
      urgent: false,
      anonymous: false,
    },
  });

  // --- History survey: submitted ------------------------------------------
  const svHist = await db.survey.create({
    data: {
      academyId,
      title: loc('Aprel · iss-prosess', 'Апрель · рабочий процесс', 'April · work process'),
      issuer: loc('Direktor', 'Директор', 'Director'),
      questions: 10,
      estimateLabel: loc('~4 daq', '~4 мин', '~4 min'),
      deadlineAt: daysAgo(50),
      urgent: false,
      anonymous: false,
    },
  });
  await db.surveyResponse.create({
    data: {
      surveyId: svHist.id,
      teacherId: teacher.id,
      status: SurveyResponseStatus.SUBMITTED,
      rating: 5,
      comment: 'Jarayon ravon, platforma tezlashtirdi.',
      progress: 100,
      submittedAt: daysAgo(54), // -> date 30.04 relative to a late-June "now" window
    },
  });

  console.log(`  surveys: 2 active (1 in-progress) + 1 history for teacher=${teacher.username}`);
}
