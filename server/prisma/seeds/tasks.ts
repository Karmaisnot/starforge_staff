/**
 * Seed the task board: projects + tasks that mirror tasksFixture exactly
 * (same titles, projects, assigners, deadlines, priorities, columns).
 *
 * TaskColumns (todo/doing/review/done) are seeded by the reference seed.ts — this
 * module references them by id and must NOT recreate them. The academy + teacher
 * already exist (pinned ids); we look them up rather than create them.
 *
 * `mine` is derived on read from ownerId === teacher, so the four "Me"-assigned
 * tasks carry ownerId; management/role-assigned tasks have a null owner. Filter
 * counts are computed from these rows, so they stay self-consistent.
 */
import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';
import { Priority, TaskColumnId } from '../../src/domain/enums';

export async function seedTasks(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;

  // --- Projects ------------------------------------------------------------
  // Names + colors mirror the PROJ map in tasksFixture.
  const projects = {
    report: await db.project.create({
      data: { academyId, name: loc('Hisobot', 'Отчёт', 'Report'), color: 'var(--sf-primary)' },
    }),
    materials: await db.project.create({
      data: { academyId, name: loc('Materiallar', 'Материалы', 'Materials'), color: 'var(--sf-accent)' },
    }),
    survey: await db.project.create({
      data: { academyId, name: loc("So'rovnoma", 'Опрос', 'Survey'), color: 'var(--sf-ai)' },
    }),
    prep: await db.project.create({
      data: { academyId, name: loc('Tayyorlov', 'Подготовка', 'Prep'), color: 'var(--sf-ink-2)' },
    }),
    center: await db.project.create({
      data: { academyId, name: loc('Markaz', 'Центр', 'Center'), color: 'var(--sf-success)' },
    }),
    students: await db.project.create({
      data: { academyId, name: loc("O'quvchilar", 'Ученики', 'Students'), color: 'var(--sf-danger)' },
    }),
    consult: await db.project.create({
      data: { academyId, name: loc('Konsult.', 'Консульт.', 'Consult.'), color: 'var(--sf-primary)' },
    }),
  };

  // assigner === "Me" is stored localized; the frontend resolves it.
  const ME = loc('Men', 'Я', 'Me');

  // One row per fixture task, in fixture order (position preserves it).
  const tasks: Array<{
    columnId: string;
    projectId: string;
    ownerId: string | null;
    title: ReturnType<typeof loc>;
    assigner: ReturnType<typeof loc> | string;
    deadlineLabel: ReturnType<typeof loc> | string;
    priority: string;
    urgent: boolean;
    fromMgmt: boolean;
    subtasksDone: number | null;
    subtasksTotal: number | null;
  }> = [
    {
      columnId: TaskColumnId.DOING,
      projectId: projects.report.id,
      ownerId: null,
      title: loc('May oyi yakuniy hisobotini topshirish', 'Сдать итоговый отчёт за май', 'Submit May final report'),
      assigner: 'Karimova R.',
      deadlineLabel: loc('Erta · 18:00', 'Завтра · 18:00', 'Tomorrow · 18:00'),
      priority: Priority.P1,
      urgent: true,
      fromMgmt: true,
      subtasksDone: 2,
      subtasksTotal: 4,
    },
    {
      columnId: TaskColumnId.TODO,
      projectId: projects.materials.id,
      ownerId: teacher.id, // mine
      title: loc('Slaydlarni yangilash · Kvadrat tenglamalar', 'Обновить слайды · Квадратные уравнения', 'Update slides · Quadratic equations'),
      assigner: ME,
      deadlineLabel: loc('Pen · 23:59', 'Чт · 23:59', 'Thu · 23:59'),
      priority: Priority.P2,
      urgent: false,
      fromMgmt: false,
      subtasksDone: 0,
      subtasksTotal: 3,
    },
    {
      columnId: TaskColumnId.DOING,
      projectId: projects.survey.id,
      ownerId: null,
      title: loc("So'rovnoma · AI sifat baholash", 'Опрос · оценка качества AI', 'Survey · AI quality rating'),
      assigner: loc('Metodist', 'Методист', 'Methodist'),
      deadlineLabel: '22.05',
      priority: Priority.P2,
      urgent: false,
      fromMgmt: true,
      subtasksDone: 1,
      subtasksTotal: 1,
    },
    {
      columnId: TaskColumnId.REVIEW,
      projectId: projects.prep.id,
      ownerId: null,
      title: loc('Olimpiada tayyorgarligi · 11-B', 'Подготовка к олимпиаде · 11-B', 'Olympiad prep · 11-B'),
      assigner: 'Yusupova N.',
      deadlineLabel: '25.05',
      priority: Priority.P3,
      urgent: false,
      fromMgmt: true,
      subtasksDone: null,
      subtasksTotal: null,
    },
    {
      columnId: TaskColumnId.DONE,
      projectId: projects.center.id,
      ownerId: null,
      title: loc("Yangi karta nomlarini ko'rib chiqish", 'Рассмотреть новые названия карт', 'Review new card names'),
      assigner: loc('Direktor', 'Директор', 'Director'),
      deadlineLabel: '18.05',
      priority: Priority.P3,
      urgent: false,
      fromMgmt: true,
      subtasksDone: null,
      subtasksTotal: null,
    },
    {
      columnId: TaskColumnId.TODO,
      projectId: projects.students.id,
      ownerId: teacher.id, // mine
      title: loc('Ota-onaga · Eshmatov O. holati', 'Родителям · ситуация Эшматова О.', 'To parents · Eshmatov O. status'),
      assigner: ME,
      deadlineLabel: loc('Pen', 'Чт', 'Thu'),
      priority: Priority.P2,
      urgent: false,
      fromMgmt: false,
      subtasksDone: null,
      subtasksTotal: null,
    },
    {
      columnId: TaskColumnId.DOING,
      projectId: projects.materials.id,
      ownerId: teacher.id, // mine
      title: loc('Dars rejasi · Logarifmlar', 'План урока · Логарифмы', 'Lesson plan · Logarithms'),
      assigner: ME,
      deadlineLabel: '23.05',
      priority: Priority.P3,
      urgent: false,
      fromMgmt: false,
      subtasksDone: 1,
      subtasksTotal: 5,
    },
    {
      columnId: TaskColumnId.REVIEW,
      projectId: projects.consult.id,
      ownerId: teacher.id, // mine
      title: loc('9-B uchun konsultatsiya rejasi', 'План консультации для 9-B', 'Consultation plan for 9-B'),
      assigner: ME,
      deadlineLabel: '24.05',
      priority: Priority.P3,
      urgent: false,
      fromMgmt: false,
      subtasksDone: null,
      subtasksTotal: null,
    },
  ];

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i]!;
    await db.task.create({
      data: {
        academyId,
        columnId: t.columnId,
        projectId: t.projectId,
        ownerId: t.ownerId,
        title: t.title,
        assigner: t.assigner,
        deadlineLabel: t.deadlineLabel,
        priority: t.priority,
        urgent: t.urgent,
        fromMgmt: t.fromMgmt,
        subtasksDone: t.subtasksDone,
        subtasksTotal: t.subtasksTotal,
        position: i,
      },
    });
  }
}
