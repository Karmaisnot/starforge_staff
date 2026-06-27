/**
 * Seed the management-chat domain: ~5 threads for the demo teacher, mirroring
 * mgmtThreadsFixture, with a full transcript (including a director task-card
 * message) for the lead thread. The tables are assumed empty; the academy and
 * teacher already exist (looked up here, never created).
 *
 * Thread previews (last message / time / unread) are NOT stored — the service
 * derives them from these message rows — so message timestamps and `read` flags
 * are chosen to make the computed list self-consistent with the fixture.
 */
import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';

/** A Date today at the given local HH:MM. */
function todayAt(hh: number, mm: number): Date {
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
}

/** A Date `daysBack` days ago at the given local HH:MM. */
function daysAgoAt(daysBack: number, hh: number, mm: number): Date {
  const d = todayAt(hh, mm);
  d.setDate(d.getDate() - daysBack);
  return d;
}

export async function seedMgmt(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow({ where: { username: 'nigora.karimova' } });
  const academyId = teacher.academyId;
  const base = { academyId, teacherId: teacher.id };

  // --- Thread 1: Director (lead, pinned, online) ---------------------------
  // Full transcript incl. an out message marked read and a director task-card.
  const director = await db.mgmtThread.create({
    data: {
      ...base,
      name: 'Karimova Rano',
      role: loc('Direktor', 'Директор', 'Director'),
      lead: true,
      pinned: true,
      online: true,
      channel: false,
    },
  });

  await db.mgmtMessage.createMany({
    data: [
      {
        threadId: director.id,
        dir: 'in',
        text: loc(
          'Salom Nigora opa. May oyi yakuniy hisobotini 23 gacha topshirsangiz bo‘ladimi?',
          'Здравствуйте, Нигора. Сможете сдать итоговый отчёт за май до 23-го?',
          'Hello Nigora. Could you submit the May final report by the 23rd?',
        ),
        read: true,
        createdAt: todayAt(11, 8),
      },
      {
        threadId: director.id,
        dir: 'out',
        text: loc(
          'Albatta. Bugun ertalab Up/Down kartalar va davomatni tahlil qilib, yopiq hisobotni jo‘nataman.',
          'Конечно. Сегодня утром проанализирую Up/Down карты и посещаемость и отправлю закрытый отчёт.',
          'Of course. This morning I will analyze Up/Down cards and attendance and send the closed report.',
        ),
        read: true,
        createdAt: todayAt(11, 14),
      },
      {
        threadId: director.id,
        dir: 'card',
        // For a card bubble the plain `text` carries the deadline display string.
        text: '23.05 · 18:00',
        taskCardEyebrow: loc('Topshiriq · direktordan', 'Задача · от директора', 'Task · from director'),
        taskCardTitle: loc('May hisoboti', 'Отчёт за май', 'May report'),
        read: false,
        createdAt: todayAt(11, 15),
      },
      {
        threadId: director.id,
        dir: 'in',
        text: loc(
          'Rahmat. Yana bitta — ertaga 14:00 da yig‘ilish, oddiy holat bo‘yicha.',
          'Спасибо. Ещё одно — завтра в 14:00 собрание, по обычным вопросам.',
          'Thanks. One more — a meeting tomorrow at 14:00, on routine matters.',
        ),
        // One unread inbound message -> thread badge shows 1 (matches fixture).
        read: false,
        createdAt: todayAt(14, 8),
      },
    ],
  });

  // --- Thread 2: Academic affairs (read, no unread) ------------------------
  const academic = await db.mgmtThread.create({
    data: {
      ...base,
      name: 'Ahmedov Botir',
      role: loc('O‘quv ishlari bo‘yicha', 'По учебной части', 'Academic affairs'),
      channel: false,
    },
  });
  await db.mgmtMessage.create({
    data: {
      threadId: academic.id,
      dir: 'in',
      text: loc(
        'Yangi karta sozlamalari haqida o‘qib chiqing.',
        'Ознакомьтесь с новыми настройками карт.',
        'Please read about the new card settings.',
      ),
      read: true,
      createdAt: todayAt(12, 42),
    },
  });

  // --- Thread 3: Methodist (two unread, earlier this week) -----------------
  const methodist = await db.mgmtThread.create({
    data: {
      ...base,
      name: 'Yusupova Nargiza',
      role: loc('Metodist · Matematika', 'Методист · Математика', 'Methodist · Mathematics'),
      channel: false,
    },
  });
  await db.mgmtMessage.createMany({
    data: [
      {
        threadId: methodist.id,
        dir: 'in',
        text: loc('Mavzular ro‘yxati yangilandi.', 'Список тем обновлён.', 'The topic list has been updated.'),
        read: false,
        createdAt: daysAgoAt(2, 16, 18),
      },
      {
        threadId: methodist.id,
        dir: 'in',
        text: loc('Mavzular ro‘yxati yangilandi.', 'Список тем обновлён.', 'The topic list has been updated.'),
        read: false,
        createdAt: daysAgoAt(2, 16, 20),
      },
    ],
  });

  // --- Thread 4: Center announcements (channel, all read) ------------------
  const channel = await db.mgmtThread.create({
    data: {
      ...base,
      name: loc('Markaz e‘lonlari', 'Объявления центра', 'Center announcements'),
      role: loc('Avtomatik · barchaga', 'Автоматически · всем', 'Automatic · to all'),
      channel: true,
    },
  });
  await db.mgmtMessage.create({
    data: {
      threadId: channel.id,
      dir: 'in',
      text: loc(
        'May oyi xulosalari · 23.05 gacha topshiring.',
        'Итоги мая · сдайте до 23.05.',
        'May summaries · submit by 23.05.',
      ),
      read: true,
      createdAt: daysAgoAt(2, 10, 0),
    },
  });

  // --- Thread 5: Branch manager (older, dated preview) ---------------------
  const manager = await db.mgmtThread.create({
    data: {
      ...base,
      name: 'Tursunov Sherzod',
      role: loc('Filial menejeri', 'Менеджер филиала', 'Branch manager'),
      channel: false,
    },
  });
  await db.mgmtMessage.create({
    data: {
      threadId: manager.id,
      dir: 'in',
      text: loc(
        'Yunusobod filialida printer almashtirildi.',
        'В филиале Юнусобод заменили принтер.',
        'The printer at the Yunusobod branch was replaced.',
      ),
      read: true,
      createdAt: daysAgoAt(10, 9, 30),
    },
  });
}
