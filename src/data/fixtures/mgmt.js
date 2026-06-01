// Management chat fixtures. Display strings carry {uz,ru,en}; repos resolve to locale.
export const mgmtThreadsFixture = [
  { id: 1, name: 'Karimova Rano', lead: true, role: { uz: 'Direktor', ru: 'Директор', en: 'Director' }, lastMessage: { uz: 'Ertangi yig‘ilish 14:00 da o‘tadi. Hisobotni ham olib keling.', ru: 'Завтрашнее собрание в 14:00. Принесите и отчёт.', en: "Tomorrow's meeting is at 14:00. Bring the report too." }, time: '14:08', unread: 1, online: true, pinned: true, channel: false },
  { id: 2, name: 'Ahmedov Botir', role: { uz: 'O‘quv ishlari bo‘yicha', ru: 'По учебной части', en: 'Academic affairs' }, lastMessage: { uz: 'Yangi karta sozlamalari haqida o‘qib chiqing.', ru: 'Ознакомьтесь с новыми настройками карт.', en: 'Please read about the new card settings.' }, time: '12:42', unread: 0, online: false, pinned: false, channel: false },
  { id: 3, name: 'Yusupova Nargiza', role: { uz: 'Metodist · Matematika', ru: 'Методист · Математика', en: 'Methodist · Mathematics' }, lastMessage: { uz: 'Mavzular ro‘yxati yangilandi.', ru: 'Список тем обновлён.', en: 'The topic list has been updated.' }, time: { uz: 'Du · 16:20', ru: 'Пн · 16:20', en: 'Mon · 16:20' }, unread: 2, online: false, pinned: false, channel: false },
  { id: 4, name: { uz: 'Markaz e‘lonlari', ru: 'Объявления центра', en: 'Center announcements' }, role: { uz: 'Avtomatik · barchaga', ru: 'Автоматически · всем', en: 'Automatic · to all' }, lastMessage: { uz: 'May oyi xulosalari · 23.05 gacha topshiring.', ru: 'Итоги мая · сдайте до 23.05.', en: 'May summaries · submit by 23.05.' }, time: { uz: 'Du · 10:00', ru: 'Пн · 10:00', en: 'Mon · 10:00' }, unread: 0, online: false, pinned: false, channel: true },
  { id: 5, name: 'Tursunov Sherzod', role: { uz: 'Filial menejeri', ru: 'Менеджер филиала', en: 'Branch manager' }, lastMessage: { uz: 'Yunusobod filialida printer almashtirildi.', ru: 'В филиале Юнусобод заменили принтер.', en: 'The printer at the Yunusobod branch was replaced.' }, time: { uz: '17 May', ru: '17 мая', en: '17 May' }, unread: 0, online: false, pinned: false, channel: false },
];

// Sample transcript for the director thread (id 1).
export const mgmtTranscriptFixture = {
  1: [
    { id: 'm1', dir: 'in', text: { uz: 'Salom Nigora opa. May oyi yakuniy hisobotini 23 gacha topshirsangiz bo‘ladimi?', ru: 'Здравствуйте, Нигора. Сможете сдать итоговый отчёт за май до 23-го?', en: 'Hello Nigora. Could you submit the May final report by the 23rd?' }, time: '11:08' },
    { id: 'm2', dir: 'out', text: { uz: 'Albatta. Bugun ertalab Up/Down kartalar va davomatni tahlil qilib, yopiq hisobotni jo‘nataman.', ru: 'Конечно. Сегодня утром проанализирую Up/Down карты и посещаемость и отправлю закрытый отчёт.', en: 'Of course. This morning I will analyze Up/Down cards and attendance and send the closed report.' }, time: '11:14', read: true },
    {
      id: 'm3',
      dir: 'card',
      taskCard: {
        eyebrow: { uz: 'Topshiriq · direktordan', ru: 'Задача · от директора', en: 'Task · from director' },
        title: { uz: 'May hisoboti', ru: 'Отчёт за май', en: 'May report' },
        deadline: '23.05 · 18:00',
      },
    },
    { id: 'm4', dir: 'in', text: { uz: 'Rahmat. Yana bitta — ertaga 14:00 da yig‘ilish, oddiy holat bo‘yicha.', ru: 'Спасибо. Ещё одно — завтра в 14:00 собрание, по обычным вопросам.', en: 'Thanks. One more — a meeting tomorrow at 14:00, on routine matters.' }, time: '14:08' },
  ],
};
