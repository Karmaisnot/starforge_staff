// AI page fixtures. Display strings carry {uz,ru,en}; repos resolve to locale.
export const aiUsageFixture = { used: 4320, limit: 50000 };

export const aiConversationsFixture = [
  { id: 1, name: '9-B Algebra', sub: { uz: '24 o‘quvchi', ru: '24 ученика', en: '24 students' }, time: { uz: 'Bugun · 11:34', ru: 'Сегодня · 11:34', en: 'Today · 11:34' }, preview: { uz: 'Bu hafta sinf umuman barqaror. 2 ta o‘quvchi diqqat talab qiladi…', ru: 'На этой неделе класс в целом стабилен. 2 ученика требуют внимания…', en: 'The class is generally stable this week. 2 students need attention…' }, pinned: true, active: true, color: 'var(--sf-primary)' },
  { id: 2, name: 'Algebra Mid', sub: { uz: '21 o‘quvchi', ru: '21 ученик', en: '21 students' }, time: { uz: 'Bugun · 09:12', ru: 'Сегодня · 09:12', en: 'Today · 09:12' }, preview: { uz: 'Davronova S. va Halimova Z. olimpiada darajasi…', ru: 'Давронова С. и Халимова З. на олимпиадном уровне…', en: 'Davronova S. and Halimova Z. at olympiad level…' }, color: 'var(--sf-primary)' },
  { id: 3, name: '10-V Geometriya', sub: { uz: '19 o‘quvchi', ru: '19 учеников', en: '19 students' }, time: { uz: 'Kecha', ru: 'Вчера', en: 'Yesterday' }, preview: { uz: 'Trapetsiya mavzusi yaxshi tushunilgan…', ru: 'Тема трапеции усвоена хорошо…', en: 'The trapezoid topic is well understood…' }, color: 'var(--sf-accent)' },
  { id: 4, name: { uz: 'Umumiy savol', ru: 'Общий вопрос', en: 'General question' }, sub: { uz: 'barcha guruhlar', ru: 'все группы', en: 'all groups' }, time: { uz: '3 kun', ru: '3 дня', en: '3 days' }, preview: { uz: '“Bu oy eng yaxshi 5 ustozni ko‘rsat”', ru: '«Покажи 5 лучших учителей за этот месяц»', en: '“Show the top 5 teachers this month”' }, color: 'var(--sf-ai)', isAll: true },
];

export const aiPromptsFixture = [
  { uz: 'Haftalik xulosa', ru: 'Недельная сводка', en: 'Weekly summary' },
  { uz: 'Kim qiynalmoqda?', ru: 'Кому трудно?', en: 'Who is struggling?' },
  { uz: 'Up karta nomzodlari', ru: 'Кандидаты на Up карту', en: 'Up card candidates' },
  { uz: 'Ota-onaga xat', ru: 'Письмо родителю', en: 'Letter to parent' },
];

export const aiContextFixture = [
  { label: { uz: 'Guruh', ru: 'Группа', en: 'Group' }, value: '9-B Algebra' },
  { label: { uz: 'O‘quvchilar', ru: 'Ученики', en: 'Students' }, value: '24' },
  { label: { uz: 'Daraja', ru: 'Уровень', en: 'Level' }, value: { uz: 'II · o‘rta', ru: 'II · средний', en: 'II · medium' } },
  { label: { uz: 'Davomat (oy)', ru: 'Посещ. (месяц)', en: 'Attendance (month)' }, value: '94%', color: 'var(--sf-success)' },
  { label: { uz: 'Up kartalar', ru: 'Up карты', en: 'Up cards' }, value: '↑18', color: '#7a4f0e' },
  { label: { uz: 'Down kartalar', ru: 'Down карты', en: 'Down cards' }, value: '↓4', color: 'var(--sf-danger)' },
  { label: { uz: 'Topshiriqlar', ru: 'Задачи', en: 'Tasks' }, value: '12' },
  { label: { uz: 'AI suhbatlar', ru: 'AI диалоги', en: 'AI chats' }, value: { uz: '7 ta', ru: '7 шт', en: '7' } },
];

export const aiAttentionFixture = [
  { name: 'Eshmatov Otabek', reason: { uz: '4 Down · 72% davomat', ru: '4 Down · 72% посещ.', en: '4 Down · 72% attendance' } },
  { name: 'Bakirov Sherzod', reason: { uz: '2 Down · 88% davomat', ru: '2 Down · 88% посещ.', en: '2 Down · 88% attendance' } },
];

export const aiTopicsFixture = [
  { uz: 'Kvadrat teng.', ru: 'Квадр. уравн.', en: 'Quadratic eq.' },
  { uz: 'Funksiyalar', ru: 'Функции', en: 'Functions' },
  { uz: 'Diskriminant', ru: 'Дискриминант', en: 'Discriminant' },
  { uz: 'Viet form.', ru: 'Формулы Виета', en: 'Vieta form.' },
  { uz: 'Logarifm', ru: 'Логарифм', en: 'Logarithm' },
  { uz: 'Tenglamalar', ru: 'Уравнения', en: 'Equations' },
];

// Structured transcript for the active conversation (the AI reply is a rich card).
export const aiTranscriptFixture = {
  outgoing1: { uz: '9-B kvadrat tenglamalar mavzusida qanday boryapti?', ru: 'Как 9-B справляется с темой квадратных уравнений?', en: 'How is 9-B doing with quadratic equations?' },
  reply: {
    leadItalic: { uz: 'Umuman barqaror.', ru: 'В целом стабильно.', en: 'Generally stable.' },
    leadRest: {
      uz: ' 24 o‘quvchidan 18 nafari mavzuni mustaqil yechmoqda. 4 nafari diskriminant formulasida xato.',
      ru: ' Из 24 учеников 18 решают тему самостоятельно. 4 ошибаются в формуле дискриминанта.',
      en: ' Of 24 students, 18 solve the topic independently. 4 make mistakes in the discriminant formula.',
    },
    stats: [
      { value: '18', label: { uz: 'O‘zlashtirdi', ru: 'Усвоили', en: 'Mastered' }, color: 'var(--sf-success)' },
      { value: '4', label: { uz: 'Qiynalmoqda', ru: 'Затрудняются', en: 'Struggling' }, color: 'var(--sf-warn)' },
      { value: '2', label: { uz: 'Tushunmagan', ru: 'Не поняли', en: 'Did not get it' }, color: 'var(--sf-danger)' },
    ],
    bar: [
      { width: '75%', color: 'var(--sf-success)' },
      { width: '17%', color: 'var(--sf-warn)' },
      { width: '8%', color: 'var(--sf-danger)' },
    ],
    focusStudents: [
      { name: 'Eshmatov Otabek', reason: { uz: 'Diskriminant ishorasi · 2 marta xato', ru: 'Знак дискриминанта · 2 ошибки', en: 'Discriminant sign · 2 mistakes' } },
      { name: 'Bakirov Sherzod', reason: { uz: 'Formulani eslamayotgan', ru: 'Не помнит формулу', en: 'Does not recall the formula' } },
    ],
    recommendationItalic: { uz: 'Tavsiya:', ru: 'Рекомендация:', en: 'Recommendation:' },
    recommendationRest: {
      uz: ' ertangi darsda 5 daqiqalik takrorlash + Eshmatov va Bakirov bilan qisqa individual ish.',
      ru: ' на завтрашнем уроке 5-минутное повторение + краткая индивидуальная работа с Эшматовым и Бакировым.',
      en: ' a 5-minute review tomorrow + short individual work with Eshmatov and Bakirov.',
    },
    actions: [
      { icon: 'doc', label: { uz: 'Takrorlash rejasi', ru: 'План повторения', en: 'Review plan' } },
      { icon: 'chat', label: { uz: 'Otabekka xabar', ru: 'Сообщение Отабеку', en: 'Message to Otabek' } },
      { icon: 'print', label: { uz: 'Chop etish', ru: 'Печать', en: 'Print' } },
    ],
    meta: { uz: 'Davomat + kartalar · 14-19 May · 420 token', ru: 'Посещаемость + карты · 14-19 мая · 420 токенов', en: 'Attendance + cards · 14-19 May · 420 tokens' },
  },
  outgoing2: { uz: 'Otabekka otasiga yoziladigan xabar tayyorla.', ru: 'Подготовь сообщение отцу Отабека.', en: "Prepare a message to Otabek's father." },
};
