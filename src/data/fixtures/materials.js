// Materials page fixtures. Display strings carry {uz,ru,en}; repos resolve to locale.
export const materialsFixture = [
  { id: 'f1', title: { uz: 'Kvadrat tenglama · slayd.pdf', ru: 'Квадратное уравнение · слайд.pdf', en: 'Quadratic equation · slide.pdf' }, meta: { uz: '2.1 MB · 8 bet', ru: '2.1 МБ · 8 стр', en: '2.1 MB · 8 pages' }, kind: 'pdf', color: 'var(--sf-danger)', views: 142, date: { uz: '14 May', ru: '14 мая', en: '14 May' }, aiSummary: true },
  { id: 'f2', title: { uz: 'Funksiyalar grafigi.mp4', ru: 'График функций.mp4', en: 'Function graph.mp4' }, meta: '24 MB · 6:42', kind: 'video', color: 'var(--sf-primary)', views: 89, date: { uz: '12 May', ru: '12 мая', en: '12 May' }, aiSummary: false },
  { id: 'f3', title: { uz: 'Mashqlar to‘plami.docx', ru: 'Сборник упражнений.docx', en: 'Exercise set.docx' }, meta: { uz: '340 KB · 12 bet', ru: '340 КБ · 12 стр', en: '340 KB · 12 pages' }, kind: 'doc', color: 'var(--sf-accent)', views: 256, date: { uz: '8 May', ru: '8 мая', en: '8 May' }, aiSummary: false },
  { id: 'f4', title: { uz: 'Olimpiada masalalari.pdf', ru: 'Олимпиадные задачи.pdf', en: 'Olympiad problems.pdf' }, meta: '1.8 MB', kind: 'pdf', color: 'var(--sf-danger)', views: 24, date: { uz: '2 May', ru: '2 мая', en: '2 May' }, aiSummary: false },
];

export const materialStatsFixture = [
  { value: '42', label: 'PDF', color: 'var(--sf-danger)' },
  { value: '18', label: { uz: 'Video', ru: 'Видео', en: 'Video' }, color: 'var(--sf-primary)' },
  { value: '24', label: { uz: 'Mashq', ru: 'Упражн.', en: 'Exercise' }, color: 'var(--sf-accent)' },
  { value: '12', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, color: 'var(--sf-success)' },
];

export const materialStorageFixture = { used: '2.1 GB', total: '12.5 GB', fileCount: 84 };
