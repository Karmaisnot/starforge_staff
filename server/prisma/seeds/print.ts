/**
 * Print domain seed: a small printer fleet, the teacher's active queue, and a
 * file library. Mirrors print.js fixtures, but every UI metric is COMPUTED from
 * these rows on read (per-printer queue depth, library file count) rather than
 * stored — so the data stays self-consistent.
 *
 * Assumes the academy + teacher already exist (pinned by the root seed).
 */
import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60_000);

export async function seedPrint(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;

  // --- Printers ------------------------------------------------------------
  // `capabilities` is the source of truth for derived display fields:
  //   - 'color' / 'A3' -> color flag + sizes label
  //   - 'eta:HH:MM'    -> a busy printer's free-at time
  const hp = await db.printer.create({
    data: {
      academyId,
      name: 'HP LaserJet · M404n',
      location: loc('Lobbi · 1-qavat', 'Лобби · 1 этаж', 'Lobby · 1st floor'),
      status: 'free',
      capabilities: [],
      createdAt: daysAgo(30),
    },
  });

  const xerox = await db.printer.create({
    data: {
      academyId,
      name: 'Xerox WorkCentre · Pro',
      location: loc('2-qavat dahliz', 'Коридор 2 этажа', '2nd floor hallway'),
      status: 'busy',
      capabilities: ['color', 'A3', 'eta:11:34'],
      createdAt: daysAgo(29),
    },
  });

  await db.printer.create({
    data: {
      academyId,
      name: 'Brother · DCP-L',
      location: loc('Direktor xonasi', 'Кабинет директора', "Director's office"),
      status: 'locked',
      capabilities: [],
      createdAt: daysAgo(28),
    },
  });

  // --- Library files -------------------------------------------------------
  // The UI shows only a COUNT (printLibraryFixture.fileCount), computed by the
  // service. Seed a coherent set; a couple are referenced by the print jobs.
  const libNames = [
    'Kvadrat tenglamalar — slayd.pdf',
    'Yulduz karta — shablon.pdf',
    'Algebra nazorat ishi.pdf',
    'Geometriya — uy vazifasi.pdf',
    'Dars rejasi — 9B.docx',
    'Olimpiada masalalari.pdf',
  ];
  const libFiles = [];
  for (let i = 0; i < libNames.length; i++) {
    libFiles.push(
      await db.libraryFile.create({
        data: {
          academyId,
          teacherId: teacher.id,
          filename: libNames[i]!,
          sizeBytes: 240_000 + i * 60_000,
          createdAt: daysAgo(10 - i),
        },
      }),
    );
  }
  const slideFile = libFiles[0]!;
  const starFile = libFiles[1]!;

  // --- Jobs ----------------------------------------------------------------
  // The teacher's two visible jobs: one printing now (HP), one queued (Xerox).
  await db.printJob.create({
    data: {
      academyId,
      printerId: hp.id,
      teacherId: teacher.id,
      libraryFileId: slideFile.id,
      doc: loc('Kvadrat tenglamalar · slayd', 'Квадратные уравнения · слайд', 'Quadratic equations · slide'),
      size: loc('A4 · B/W', 'A4 · ч/б', 'A4 · B/W'),
      copies: 24,
      state: 'now',
      progress: 64,
      createdAt: minutesAgo(3),
    },
  });

  await db.printJob.create({
    data: {
      academyId,
      printerId: xerox.id,
      teacherId: teacher.id,
      libraryFileId: starFile.id,
      doc: loc('Yulduz karta · 6 nusxa', 'Звёздная карта · 6 копий', 'Star card · 6 copies'),
      size: loc('A5 · rang', 'A5 · цвет', 'A5 · color'),
      copies: 6,
      state: 'queued',
      progress: 0,
      createdAt: minutesAgo(1),
    },
  });
}
