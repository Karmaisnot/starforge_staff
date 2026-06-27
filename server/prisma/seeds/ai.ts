/**
 * AI assistant seed — conversations, messages (the active conversation's rich
 * transcript), and the per-teacher active-conversation pointer. AiUsage is
 * seeded by the root teacher record, so it is intentionally left untouched here.
 *
 * Mirrors aiConversationsFixture / aiTranscriptFixture: conversation names,
 * previews and the structured analysis reply match the fixture content, while
 * sub/time/context/attention are COMPUTED on read from the live roster + cards.
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { loc } from '../../src/shared/locale';
import { AiRole } from '../../src/domain/enums';

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60_000);

/**
 * `preview` is a curated per-conversation summary column (AiConversation.preview,
 * Json?) added centrally; cast through here so the seed compiles against the
 * generated client even before its types are regenerated.
 */
type ConvCreate = Prisma.AiConversationUncheckedCreateInput & { preview: unknown };
const convData = (data: ConvCreate): Prisma.AiConversationUncheckedCreateInput =>
  data as unknown as Prisma.AiConversationUncheckedCreateInput;

export async function seedAi(db: PrismaClient): Promise<void> {
  const teacher = await db.teacher.findFirstOrThrow();
  const academyId = teacher.academyId;
  const teacherId = teacher.id;

  // Resolve the cohort ids the conversations attach to (pinned slugs).
  const [cohort9b, cohortMid, cohortGeo] = await Promise.all([
    db.cohort.findFirst({ where: { id: '9b-algebra', academyId } }),
    db.cohort.findFirst({ where: { id: 'algebra-mid', academyId } }),
    db.cohort.findFirst({ where: { id: '10v-geometriya', academyId } }),
  ]);

  // --- Conversations -------------------------------------------------------
  // Names are plain strings for the cohort-bound chats (display parity with the
  // fixture); the "general" chat carries a localized name + isAll flag.
  const conv9b = await db.aiConversation.create({
    data: convData({
      academyId,
      teacherId,
      cohortId: cohort9b?.id ?? null,
      name: '9-B Algebra',
      pinned: true,
      color: 'var(--sf-primary)',
      preview: loc(
        'Bu hafta sinf umuman barqaror. 2 ta o‘quvchi diqqat talab qiladi…',
        'На этой неделе класс в целом стабилен. 2 ученика требуют внимания…',
        'The class is generally stable this week. 2 students need attention…',
      ),
      lastMessageAt: minutesAgo(8),
    }),
  });

  await db.aiConversation.create({
    data: convData({
      academyId,
      teacherId,
      cohortId: cohortMid?.id ?? null,
      name: 'Algebra Mid',
      color: 'var(--sf-primary)',
      preview: loc(
        'Davronova S. va Halimova Z. olimpiada darajasi…',
        'Давронова С. и Халимова З. на олимпиадном уровне…',
        'Davronova S. and Halimova Z. at olympiad level…',
      ),
      lastMessageAt: minutesAgo(150),
    }),
  });

  await db.aiConversation.create({
    data: convData({
      academyId,
      teacherId,
      cohortId: cohortGeo?.id ?? null,
      name: '10-V Geometriya',
      color: 'var(--sf-accent)',
      preview: loc(
        'Trapetsiya mavzusi yaxshi tushunilgan…',
        'Тема трапеции усвоена хорошо…',
        'The trapezoid topic is well understood…',
      ),
      lastMessageAt: daysAgo(1),
    }),
  });

  await db.aiConversation.create({
    data: convData({
      academyId,
      teacherId,
      cohortId: null,
      name: loc('Umumiy savol', 'Общий вопрос', 'General question'),
      isAll: true,
      color: 'var(--sf-ai)',
      preview: loc(
        '“Bu oy eng yaxshi 5 ustozni ko‘rsat”',
        '«Покажи 5 лучших учителей за этот месяц»',
        '“Show the top 5 teachers this month”',
      ),
      lastMessageAt: daysAgo(3),
    }),
  });

  // --- Active conversation transcript (rich AI reply) ----------------------
  // The transcript is two outgoing messages around one structured AI reply. Each
  // message's text is a JSON-encoded localized leaf; the reply is the serialized
  // analysis card the fixture describes (mapped back on read by mapTranscript).
  const reply = {
    leadItalic: loc('Umuman barqaror.', 'В целом стабильно.', 'Generally stable.'),
    leadRest: loc(
      ' 24 o‘quvchidan 18 nafari mavzuni mustaqil yechmoqda. 4 nafari diskriminant formulasida xato.',
      ' Из 24 учеников 18 решают тему самостоятельно. 4 ошибаются в формуле дискриминанта.',
      ' Of 24 students, 18 solve the topic independently. 4 make mistakes in the discriminant formula.',
    ),
    stats: [
      { value: '18', label: loc('O‘zlashtirdi', 'Усвоили', 'Mastered'), color: 'var(--sf-success)' },
      { value: '4', label: loc('Qiynalmoqda', 'Затрудняются', 'Struggling'), color: 'var(--sf-warn)' },
      { value: '2', label: loc('Tushunmagan', 'Не поняли', 'Did not get it'), color: 'var(--sf-danger)' },
    ],
    bar: [
      { width: '75%', color: 'var(--sf-success)' },
      { width: '17%', color: 'var(--sf-warn)' },
      { width: '8%', color: 'var(--sf-danger)' },
    ],
    focusStudents: [
      {
        name: 'Eshmatov Otabek',
        reason: loc('Diskriminant ishorasi · 2 marta xato', 'Знак дискриминанта · 2 ошибки', 'Discriminant sign · 2 mistakes'),
      },
      {
        name: 'Bakirov Sherzod',
        reason: loc('Formulani eslamayotgan', 'Не помнит формулу', 'Does not recall the formula'),
      },
    ],
    recommendationItalic: loc('Tavsiya:', 'Рекомендация:', 'Recommendation:'),
    recommendationRest: loc(
      ' ertangi darsda 5 daqiqalik takrorlash + Eshmatov va Bakirov bilan qisqa individual ish.',
      ' на завтрашнем уроке 5-минутное повторение + краткая индивидуальная работа с Эшматовым и Бакировым.',
      ' a 5-minute review tomorrow + short individual work with Eshmatov and Bakirov.',
    ),
    actions: [
      { icon: 'doc', label: loc('Takrorlash rejasi', 'План повторения', 'Review plan') },
      { icon: 'chat', label: loc('Otabekka xabar', 'Сообщение Отабеку', 'Message to Otabek') },
      { icon: 'print', label: loc('Chop etish', 'Печать', 'Print') },
    ],
    meta: loc(
      'Davomat + kartalar · 14-19 May · 420 token',
      'Посещаемость + карты · 14-19 мая · 420 токенов',
      'Attendance + cards · 14-19 May · 420 tokens',
    ),
  };

  const outgoing1 = loc(
    '9-B kvadrat tenglamalar mavzusida qanday boryapti?',
    'Как 9-B справляется с темой квадратных уравнений?',
    'How is 9-B doing with quadratic equations?',
  );
  const outgoing2 = loc(
    'Otabekka otasiga yoziladigan xabar tayyorla.',
    'Подготовь сообщение отцу Отабека.',
    "Prepare a message to Otabek's father.",
  );

  await db.aiMessage.createMany({
    data: [
      {
        conversationId: conv9b.id,
        role: AiRole.USER,
        text: JSON.stringify(outgoing1),
        tokens: 24,
        createdAt: minutesAgo(12),
      },
      {
        conversationId: conv9b.id,
        role: AiRole.AI,
        text: JSON.stringify(reply),
        tokens: 420,
        createdAt: minutesAgo(11),
      },
      {
        conversationId: conv9b.id,
        role: AiRole.USER,
        text: JSON.stringify(outgoing2),
        tokens: 18,
        createdAt: minutesAgo(8),
      },
    ],
  });

  // --- Active pointer ------------------------------------------------------
  // Point the teacher's open AI conversation at 9-B (the one with the analysis),
  // so getActiveConversation/getWorkspace resolve to this transcript.
  await db.teacher.update({
    where: { id: teacherId },
    data: { activeAiConversationId: conv9b.id },
  });
}
