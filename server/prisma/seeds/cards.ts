/**
 * Seed the cards domain: the card-type catalogue + a coherent body of issued
 * cards. The Cards page metrics (per-type counts, weekly up/down, distinct
 * recipients, week-over-week trend) are all COMPUTED from these rows in the
 * service, so they stay self-consistent with what's seeded here.
 *
 * Assumes the academy, the teacher (`teacher-nigora`), the three cohorts
 * (`9b-algebra`, `algebra-mid`, `10v-geometriya`) and their students already
 * exist; this module only inserts CardType + Card rows. Tables are empty on entry.
 */
import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';
import { CardKind } from '../../src/domain/enums';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60_000);

export async function seedCards(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;

  // --- Card types (catalogue) ----------------------------------------------
  const ct = {
    star: await db.cardType.create({ data: { academyId, kind: CardKind.UP, position: 0, name: loc('Yulduz karta', 'Звёздная карта', 'Star card'), subtitle: loc('Asosiy +', 'Основной +', 'Primary +') } }),
    activity: await db.cardType.create({ data: { academyId, kind: CardKind.UP, position: 1, name: loc('Aktivlik', 'Активность', 'Activity'), subtitle: loc('Darsda ishtirok', 'Участие в уроке', 'Class participation') } }),
    helper: await db.cardType.create({ data: { academyId, kind: CardKind.UP, position: 2, name: loc('Yordamchi', 'Помощник', 'Helper'), subtitle: loc('Sinfdosh yordami', 'Помощь однокласснику', 'Helping a classmate') } }),
    tidy: await db.cardType.create({ data: { academyId, kind: CardKind.UP, position: 3, name: loc('Toza ish', 'Аккуратность', 'Tidy work'), subtitle: loc('Daftar / vazifa', 'Тетрадь / задание', 'Notebook / task') } }),
    warning: await db.cardType.create({ data: { academyId, kind: CardKind.DOWN, position: 4, name: loc('Ogohlantirish', 'Предупреждение', 'Warning'), subtitle: loc('Asosiy −', 'Основной −', 'Primary −') } }),
    irresp: await db.cardType.create({ data: { academyId, kind: CardKind.DOWN, position: 5, name: loc("Mas'uliyatsizlik", 'Безответственность', 'Irresponsibility'), subtitle: loc('Uy ishi · kechikish', 'Домашка · опоздание', 'Homework · lateness') } }),
  };

  // --- Resolve cohorts + the named 9-B roster the recent cards reference -----
  const cohort9b = await db.cohort.findFirstOrThrow({ where: { academyId, name: '9-B Algebra' } });
  const cohortMid = await db.cohort.findFirstOrThrow({ where: { academyId, name: 'Algebra Mid' } });
  const cohortGeo = await db.cohort.findFirstOrThrow({ where: { academyId, name: '10-V Geometriya' } });

  const s9b = await db.student.findMany({ where: { cohortId: cohort9b.id }, orderBy: { createdAt: 'asc' } });
  const sMid = await db.student.findMany({ where: { cohortId: cohortMid.id }, orderBy: { createdAt: 'asc' } });
  const sGeo = await db.student.findMany({ where: { cohortId: cohortGeo.id }, orderBy: { createdAt: 'asc' } });

  // Address the named 9-B students by name so the recent feed matches the fixture.
  const byName = new Map(s9b.map((s) => [s.name, s]));
  const need = (name: string) => {
    const s = byName.get(name);
    if (!s) throw new Error(`seedCards: expected 9-B student "${name}" not found`);
    return s;
  };

  async function issueCard(opts: {
    typeId: string; kind: string; studentId: string; cohortId: string;
    reason?: ReturnType<typeof loc>; createdAt: Date;
  }) {
    await db.card.create({
      data: {
        academyId, cardTypeId: opts.typeId, kind: opts.kind,
        studentId: opts.studentId, cohortId: opts.cohortId, issuerId: teacher.id,
        reason: opts.reason ?? undefined, createdAt: opts.createdAt,
      },
    });
  }

  // --- Six explicit "recent" cards (drive the activity feed / `when` labels) -
  const recent: Array<{ name: string; type: string; kind: string; reason: ReturnType<typeof loc>; mins: number }> = [
    { name: 'Akbarov Akmal', type: ct.star.id, kind: 'up', reason: loc('Mustaqil yechim · 3-misol', 'Самостоятельное решение · пример 3', 'Independent solution · problem 3'), mins: 18 },
    { name: 'Halimova Zilola', type: ct.activity.id, kind: 'up', reason: loc('Sinfdoshlariga yordam berdi', 'Помогла одноклассникам', 'Helped classmates'), mins: 22 },
    { name: 'Eshmatov Otabek', type: ct.warning.id, kind: 'down', reason: loc('Uy ishi tayyor emas (2-marta)', 'Домашка не готова (2-й раз)', 'Homework not ready (2nd time)'), mins: 48 },
    { name: 'Davronova Sevinch', type: ct.star.id, kind: 'up', reason: loc('Toza daftar', 'Аккуратная тетрадь', 'Tidy notebook'), mins: 70 },
    { name: 'Bakirov Sherzod', type: ct.warning.id, kind: 'down', reason: loc('Darsda telefon bilan', 'С телефоном на уроке', 'Phone during lesson'), mins: 95 },
    { name: 'Azizova Madina', type: ct.star.id, kind: 'up', reason: loc('Olimpiada 2-bosqich', 'Олимпиада, 2-й этап', 'Olympiad, round 2'), mins: 140 },
  ];

  // Per-student target tallies (mirror the roster fixture); track what's already issued.
  const targets: Array<{ name: string; up: number; down: number }> = [
    { name: 'Akbarov Akmal', up: 8, down: 0 },
    { name: 'Azizova Madina', up: 6, down: 0 },
    { name: 'Bakirov Sherzod', up: 2, down: 2 },
    { name: 'Davronova Sevinch', up: 4, down: 0 },
    { name: 'Eshmatov Otabek', up: 1, down: 4 },
    { name: 'Halimova Zilola', up: 7, down: 0 },
  ];
  const issuedUp = new Map<string, number>();
  const issuedDown = new Map<string, number>();

  for (const r of recent) {
    const student = need(r.name);
    await issueCard({ typeId: r.type, kind: r.kind, studentId: student.id, cohortId: cohort9b.id, reason: r.reason, createdAt: minutesAgo(r.mins) });
    const m = r.kind === 'up' ? issuedUp : issuedDown;
    m.set(r.name, (m.get(r.name) ?? 0) + 1);
  }

  // --- Top up each named student to its target with generic cards -----------
  const upTypes = [ct.star, ct.activity, ct.helper, ct.tidy];
  const downTypes = [ct.warning, ct.irresp];
  for (const t of targets) {
    const student = need(t.name);
    for (let k = issuedUp.get(t.name) ?? 0; k < t.up; k++) {
      await issueCard({ typeId: upTypes[k % upTypes.length]!.id, kind: 'up', studentId: student.id, cohortId: cohort9b.id, createdAt: daysAgo(2 + (k % 6)) });
    }
    for (let k = issuedDown.get(t.name) ?? 0; k < t.down; k++) {
      await issueCard({ typeId: downTypes[k % downTypes.length]!.id, kind: 'down', studentId: student.id, cohortId: cohort9b.id, createdAt: daysAgo(2 + (k % 6)) });
    }
  }

  // --- A handful of cards for the other cohorts so they're populated --------
  for (let i = 0; i < sMid.length; i++) {
    const reps = (i % 3) + 1;
    for (let k = 0; k < reps; k++) {
      await issueCard({ typeId: ct.activity.id, kind: 'up', studentId: sMid[i]!.id, cohortId: cohortMid.id, createdAt: daysAgo(1 + k) });
    }
  }
  for (let i = 0; i < sGeo.length; i++) {
    if (i % 4 === 0) await issueCard({ typeId: ct.warning.id, kind: 'down', studentId: sGeo[i]!.id, cohortId: cohortGeo.id, createdAt: daysAgo(1 + i) });
    else await issueCard({ typeId: ct.star.id, kind: 'up', studentId: sGeo[i]!.id, cohortId: cohortGeo.id, createdAt: daysAgo(1 + i) });
  }
}
