// Notification fixtures. Display strings carry {uz,ru,en}; repos resolve to locale.
export const notificationGroupsFixture = [
  {
    label: { uz: 'Bugun', ru: 'Сегодня', en: 'Today' },
    items: [
      { tone: 'ai', icon: 'AI', title: { uz: 'AI tavsiyasi', ru: 'Рекомендация AI', en: 'AI recommendation' }, body: { uz: '9-B uchun ertangi darsda kvadrat tenglamalarni qisqa qaytarish tavsiya etiladi.', ru: 'Для 9-B рекомендуется краткое повторение квадратных уравнений на завтрашнем уроке.', en: 'A short review of quadratic equations is recommended for 9-B in tomorrow’s lesson.' }, time: '08:42' },
      { tone: 'primary', icon: 'check', title: { uz: 'Davomat saqlandi', ru: 'Посещаемость сохранена', en: 'Attendance saved' }, body: { uz: 'Algebra Mid · 21/22 belgilandi.', ru: 'Algebra Mid · отмечено 21/22.', en: 'Algebra Mid · 21/22 marked.' }, time: '10:05' },
      { tone: 'success', icon: 'print', title: { uz: 'Print tayyor', ru: 'Печать готова', en: 'Print ready' }, body: { uz: 'Kvadrat tenglamalar · 24 nusxa · HP LaserJet · lobbi', ru: 'Квадратные уравнения · 24 копии · HP LaserJet · лобби', en: 'Quadratic equations · 24 copies · HP LaserJet · lobby' }, time: '11:24' },
      { tone: 'accent', icon: 'chat', title: { uz: 'Ota-onadan xabar', ru: 'Сообщение от родителя', en: 'Message from parent' }, body: { uz: 'Akbarova D. (Akmal ona) sizga yozdi · 9-B', ru: 'Акбарова Д. (мама Акмала) написала вам · 9-B', en: 'Akbarova D. (Akmal’s mother) messaged you · 9-B' }, time: '11:14' },
      { tone: 'warn', icon: 'flag', title: { uz: 'Eshmatov Otabek · 3-Down karta', ru: 'Эшматов Отабек · 3-я Down карта', en: 'Eshmatov Otabek · 3rd Down card' }, body: { uz: '9-B Algebra · ota-onaga avtomatik xabar yuborildi.', ru: '9-B Algebra · родителю отправлено автоматическое сообщение.', en: '9-B Algebra · an automatic message was sent to the parent.' }, time: '11:42' },
    ],
  },
  {
    label: { uz: 'Kecha', ru: 'Вчера', en: 'Yesterday' },
    items: [
      { tone: 'success', icon: 'print', title: { uz: 'Print tugadi', ru: 'Печать завершена', en: 'Print finished' }, body: { uz: 'Yulduz karta · 12 nusxa · A5 rangli · Xerox WC Pro', ru: 'Звёздная карта · 12 копий · A5 цветная · Xerox WC Pro', en: 'Star card · 12 copies · A5 color · Xerox WC Pro' }, time: { uz: 'Du · 16:50', ru: 'Пн · 16:50', en: 'Mon · 16:50' } },
      { tone: 'ai', icon: 'AI', title: { uz: 'Suhbat · 10-V', ru: 'Диалог · 10-V', en: 'Chat · 10-V' }, body: { uz: '“Trapetsiya mavzusi yaxshi tushunilgan. 11-misol uchun ekstra…”', ru: '«Тема трапеции усвоена хорошо. Для примера 11 — дополнительно…»', en: '“The trapezoid topic is well understood. Extra for problem 11…”' }, time: { uz: 'Du · 15:20', ru: 'Пн · 15:20', en: 'Mon · 15:20' } },
      { tone: 'primary', icon: 'chat', title: { uz: 'O‘quvchidan savol', ru: 'Вопрос от ученика', en: 'Question from student' }, body: { uz: 'Halimova Zilola sizga yozdi · uy ishi', ru: 'Халимова Зилола написала вам · домашка', en: 'Halimova Zilola messaged you · homework' }, time: { uz: 'Du · 14:08', ru: 'Пн · 14:08', en: 'Mon · 14:08' } },
      { tone: 'neutral', icon: 'upload', title: { uz: 'Haftalik hisobot', ru: 'Недельный отчёт', en: 'Weekly report' }, body: { uz: '14 May – 19 May · yuklab olishga tayyor.', ru: '14 мая – 19 мая · готов к загрузке.', en: '14 May – 19 May · ready to download.' }, time: { uz: 'Du · 09:00', ru: 'Пн · 09:00', en: 'Mon · 09:00' } },
    ],
  },
];

export const notificationFiltersFixture = [
  { label: { uz: 'Hammasi', ru: 'Все', en: 'All' }, count: 9, key: 'all' },
  { label: 'AI', count: 2, key: 'ai' },
  { label: { uz: 'Print', ru: 'Печать', en: 'Print' }, count: 2, key: 'print' },
  { label: { uz: 'Xabar', ru: 'Сообщения', en: 'Messages' }, count: 2, key: 'msg' },
];
