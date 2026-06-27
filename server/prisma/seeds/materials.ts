/**
 * Seed the teacher's materials library. Mirrors materialsFixture (same titles,
 * localized leaves, AI-summary flag) plus a couple extra rows so the stats strip
 * and storage totals are coherent and self-consistent when COMPUTED on read.
 *
 * Assumes the tenant/teacher already exist; looks them up rather than creating.
 */
import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';
import { MaterialKind } from '../../src/domain/enums';

const KB = 1024;
const MB = KB * 1024;
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60_000);

export async function seedMaterials(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;
  const ownerId = teacher.id;

  // sizeBytes is chosen so the `meta` size and the computed storage `used` agree.
  const rows = [
    {
      kind: MaterialKind.PDF,
      title: loc('Kvadrat tenglama · slayd.pdf', 'Квадратное уравнение · слайд.pdf', 'Quadratic equation · slide.pdf'),
      meta: loc('2.1 MB · 8 bet', '2.1 МБ · 8 стр', '2.1 MB · 8 pages'),
      sizeBytes: Math.round(2.1 * MB),
      views: 142,
      aiSummary: true,
      days: 5,
    },
    {
      kind: MaterialKind.VIDEO,
      title: loc('Funksiyalar grafigi.mp4', 'График функций.mp4', 'Function graph.mp4'),
      meta: '24 MB · 6:42', // plain string in fixture
      sizeBytes: 24 * MB,
      views: 89,
      aiSummary: false,
      days: 7,
    },
    {
      kind: MaterialKind.DOC,
      title: loc('Mashqlar to‘plami.docx', 'Сборник упражнений.docx', 'Exercise set.docx'),
      meta: loc('340 KB · 12 bet', '340 КБ · 12 стр', '340 KB · 12 pages'),
      sizeBytes: 340 * KB,
      views: 256,
      aiSummary: false,
      days: 11,
    },
    {
      kind: MaterialKind.PDF,
      title: loc('Olimpiada masalalari.pdf', 'Олимпиадные задачи.pdf', 'Olympiad problems.pdf'),
      meta: '1.8 MB', // plain string in fixture
      sizeBytes: Math.round(1.8 * MB),
      views: 24,
      aiSummary: false,
      days: 17,
    },
    {
      kind: MaterialKind.VIDEO,
      title: loc('Geometriya · isbotlar.mp4', 'Геометрия · доказательства.mp4', 'Geometry · proofs.mp4'),
      meta: '38 MB · 9:10',
      sizeBytes: 38 * MB,
      views: 61,
      aiSummary: false,
      days: 21,
    },
    {
      kind: MaterialKind.DOC,
      title: loc('Nazorat ishi · variant A.docx', 'Контрольная · вариант A.docx', 'Test paper · variant A.docx'),
      meta: loc('512 KB · 4 bet', '512 КБ · 4 стр', '512 KB · 4 pages'),
      sizeBytes: 512 * KB,
      views: 118,
      aiSummary: true,
      days: 26,
    },
  ];

  await db.material.createMany({
    data: rows.map((r) => ({
      academyId,
      ownerId,
      kind: r.kind,
      title: r.title,
      meta: r.meta,
      sizeBytes: r.sizeBytes,
      views: r.views,
      aiSummary: r.aiSummary,
      createdAt: daysAgo(r.days),
    })),
  });
}
