// Print page fixtures. Display strings carry {uz,ru,en}; repos resolve to locale.
export const printersFixture = [
  { id: 'hp', name: 'HP LaserJet · M404n', location: { uz: 'Lobbi · 1-qavat', ru: 'Лобби · 1 этаж', en: 'Lobby · 1st floor' }, status: 'free', eta: { uz: 'Hozir tayyor', ru: 'Готов сейчас', en: 'Ready now' }, queue: 0, color: false, sizes: 'A4', accent: 'var(--sf-success)' },
  { id: 'xerox', name: 'Xerox WorkCentre · Pro', location: { uz: '2-qavat dahliz', ru: 'Коридор 2 этажа', en: '2nd floor hallway' }, status: 'busy', eta: { uz: '11:34 da bo‘shaydi', ru: 'Освободится в 11:34', en: 'Free at 11:34' }, queue: 2, color: true, sizes: 'A4 · A3 · color', accent: 'var(--sf-warn)' },
  { id: 'brother', name: 'Brother · DCP-L', location: { uz: 'Direktor xonasi', ru: 'Кабинет директора', en: "Director's office" }, status: 'locked', eta: { uz: 'Faqat ma‘muriyat', ru: 'Только администрация', en: 'Admin only' }, queue: 0, color: false, sizes: 'A4', accent: 'var(--sf-muted)' },
];

export const printJobsFixture = [
  { id: 'j1', doc: { uz: 'Kvadrat tenglamalar · slayd', ru: 'Квадратные уравнения · слайд', en: 'Quadratic equations · slide' }, icon: 'doc', copies: 24, size: { uz: 'A4 · B/W', ru: 'A4 · ч/б', en: 'A4 · B/W' }, printer: 'HP LaserJet', progress: 64, eta: { uz: 'Tugaydi · 11:24', ru: 'Закончит · 11:24', en: 'Done · 11:24' }, state: 'now' },
  { id: 'j2', doc: { uz: 'Yulduz karta · 6 nusxa', ru: 'Звёздная карта · 6 копий', en: 'Star card · 6 copies' }, icon: 'brand', copies: 6, size: { uz: 'A5 · rang', ru: 'A5 · цвет', en: 'A5 · color' }, printer: 'Xerox WorkCentre', progress: 0, eta: { uz: 'Boshlanadi · 11:38', ru: 'Начнёт · 11:38', en: 'Starts · 11:38' }, state: 'queued' },
];

export const printLibraryFixture = { fileCount: 84 };
