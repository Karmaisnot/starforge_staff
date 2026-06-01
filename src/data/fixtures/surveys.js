// Survey page fixtures. Display strings carry {uz,ru,en}; repos resolve to locale.
export const activeSurveysFixture = [
  { id: 'sv1', title: { uz: 'Oylik o‘qituvchi qoniqishi', ru: 'Ежемесячная удовлетворённость учителя', en: 'Monthly teacher satisfaction' }, issuer: { uz: 'Karimova R. · Direktor', ru: 'Каримова Р. · Директор', en: 'Karimova R. · Director' }, deadline: '22.05 · 23:59', remaining: { uz: '2 kun 14 soat', ru: '2 дня 14 ч', en: '2 days 14 h' }, questions: 12, estimate: { uz: '~4 daq', ru: '~4 мин', en: '~4 min' }, progress: 33, urgent: true },
  { id: 'sv2', title: { uz: 'Karta tizimi · taklif va e‘tirozlar', ru: 'Система карт · предложения и замечания', en: 'Card system · suggestions and objections' }, issuer: { uz: 'Ahmedov B. · O‘quv ishlari', ru: 'Ахмедов Б. · Учебная часть', en: 'Ahmedov B. · Academic affairs' }, deadline: '26.05 · 18:00', remaining: { uz: '6 kun', ru: '6 дней', en: '6 days' }, questions: 8, estimate: { uz: '~3 daq', ru: '~3 мин', en: '~3 min' }, progress: 0, urgent: false },
];

export const surveyHistoryFixture = [
  { title: { uz: 'Aprel · iss-prosess', ru: 'Апрель · рабочий процесс', en: 'April · work process' }, issuer: { uz: 'Direktor', ru: 'Директор', en: 'Director' }, status: { uz: 'Topshirildi', ru: 'Сдано', en: 'Submitted' }, skipped: false, date: '30.04' },
  { title: { uz: 'Yangi platforma qulayligi', ru: 'Удобство новой платформы', en: 'New platform usability' }, issuer: { uz: 'Markaz', ru: 'Центр', en: 'Center' }, status: { uz: 'Topshirildi', ru: 'Сдано', en: 'Submitted' }, skipped: false, date: '15.04' },
  { title: { uz: 'AI tavsiyalarining sifati', ru: 'Качество рекомендаций AI', en: 'AI recommendation quality' }, issuer: { uz: 'Metodist', ru: 'Методист', en: 'Methodist' }, status: { uz: 'O‘tkazib yuborilgan', ru: 'Пропущено', en: 'Skipped' }, skipped: true, date: '01.04' },
];
