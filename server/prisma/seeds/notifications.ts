import { PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';
import { NotificationTone } from '../../src/domain/enums';

/**
 * Seed a coherent notification inbox for the demo teacher: ~5 "today" + ~4
 * "yesterday" rows mirroring `notificationsFixture`, with varied tone/icon so
 * the computed filter facets (all / AI / print / messages) line up with the UI.
 *
 * Times are encoded in `createdAt` at specific local-clock hours; the service
 * buckets by local-day boundary (today vs. yesterday) and the mapper renders the
 * clock — so the displayed "08:42" / "Du · 16:50" strings fall out of the data.
 *
 * Assumes the academy + teacher already exist and the table is empty.
 */
export async function seedNotifications(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;
  const recipientId = teacher.id;

  // Build a Date for `daysBack` days ago at the given local hour:minute.
  const at = (daysBack: number, hh: number, mm: number): Date => {
    const d = new Date();
    d.setDate(d.getDate() - daysBack);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  type Row = {
    tone: string;
    icon: string;
    title: ReturnType<typeof loc>;
    body: ReturnType<typeof loc>;
    createdAt: Date;
    read: boolean;
  };

  const rows: Row[] = [
    // --- Today (Bugun) -----------------------------------------------------
    {
      tone: NotificationTone.AI,
      icon: 'AI',
      title: loc('AI tavsiyasi', 'Рекомендация AI', 'AI recommendation'),
      body: loc(
        '9-B uchun ertangi darsda kvadrat tenglamalarni qisqa qaytarish tavsiya etiladi.',
        'Для 9-B рекомендуется краткое повторение квадратных уравнений на завтрашнем уроке.',
        'A short review of quadratic equations is recommended for 9-B in tomorrow’s lesson.',
      ),
      createdAt: at(0, 8, 42),
      read: false,
    },
    {
      tone: NotificationTone.PRIMARY,
      icon: 'check',
      title: loc('Davomat saqlandi', 'Посещаемость сохранена', 'Attendance saved'),
      body: loc('Algebra Mid · 21/22 belgilandi.', 'Algebra Mid · отмечено 21/22.', 'Algebra Mid · 21/22 marked.'),
      createdAt: at(0, 10, 5),
      read: false,
    },
    {
      tone: NotificationTone.SUCCESS,
      icon: 'print',
      title: loc('Print tayyor', 'Печать готова', 'Print ready'),
      body: loc(
        'Kvadrat tenglamalar · 24 nusxa · HP LaserJet · lobbi',
        'Квадратные уравнения · 24 копии · HP LaserJet · лобби',
        'Quadratic equations · 24 copies · HP LaserJet · lobby',
      ),
      createdAt: at(0, 11, 24),
      read: false,
    },
    {
      tone: NotificationTone.ACCENT,
      icon: 'chat',
      title: loc('Ota-onadan xabar', 'Сообщение от родителя', 'Message from parent'),
      body: loc(
        'Akbarova D. (Akmal ona) sizga yozdi · 9-B',
        'Акбарова Д. (мама Акмала) написала вам · 9-B',
        'Akbarova D. (Akmal’s mother) messaged you · 9-B',
      ),
      createdAt: at(0, 11, 14),
      read: false,
    },
    {
      tone: NotificationTone.WARN,
      icon: 'flag',
      title: loc('Eshmatov Otabek · 3-Down karta', 'Эшматов Отабек · 3-я Down карта', 'Eshmatov Otabek · 3rd Down card'),
      body: loc(
        '9-B Algebra · ota-onaga avtomatik xabar yuborildi.',
        '9-B Algebra · родителю отправлено автоматическое сообщение.',
        '9-B Algebra · an automatic message was sent to the parent.',
      ),
      createdAt: at(0, 11, 42),
      read: false,
    },

    // --- Yesterday (Kecha) -------------------------------------------------
    {
      tone: NotificationTone.SUCCESS,
      icon: 'print',
      title: loc('Print tugadi', 'Печать завершена', 'Print finished'),
      body: loc(
        'Yulduz karta · 12 nusxa · A5 rangli · Xerox WC Pro',
        'Звёздная карта · 12 копий · A5 цветная · Xerox WC Pro',
        'Star card · 12 copies · A5 color · Xerox WC Pro',
      ),
      createdAt: at(1, 16, 50),
      read: true,
    },
    {
      tone: NotificationTone.AI,
      icon: 'AI',
      title: loc('Suhbat · 10-V', 'Диалог · 10-V', 'Chat · 10-V'),
      body: loc(
        '“Trapetsiya mavzusi yaxshi tushunilgan. 11-misol uchun ekstra…”',
        '«Тема трапеции усвоена хорошо. Для примера 11 — дополнительно…»',
        '“The trapezoid topic is well understood. Extra for problem 11…”',
      ),
      createdAt: at(1, 15, 20),
      read: true,
    },
    {
      tone: NotificationTone.PRIMARY,
      icon: 'chat',
      title: loc('O‘quvchidan savol', 'Вопрос от ученика', 'Question from student'),
      body: loc(
        'Halimova Zilola sizga yozdi · uy ishi',
        'Халимова Зилола написала вам · домашка',
        'Halimova Zilola messaged you · homework',
      ),
      createdAt: at(1, 14, 8),
      read: true,
    },
    {
      tone: NotificationTone.NEUTRAL,
      icon: 'upload',
      title: loc('Haftalik hisobot', 'Недельный отчёт', 'Weekly report'),
      body: loc(
        '14 May – 19 May · yuklab olishga tayyor.',
        '14 мая – 19 мая · готов к загрузке.',
        '14 May – 19 May · ready to download.',
      ),
      createdAt: at(1, 9, 0),
      read: true,
    },
  ];

  await db.notification.createMany({
    data: rows.map((r) => ({
      academyId,
      recipientId,
      tone: r.tone,
      icon: r.icon,
      title: r.title,
      body: r.body,
      read: r.read,
      createdAt: r.createdAt,
    })),
  });
}
