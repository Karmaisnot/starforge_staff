const L2 = { uz: 'Daraja II', ru: 'Уровень II', en: 'Level II' };
const L3 = { uz: 'Daraja III', ru: 'Уровень III', en: 'Level III' };

export const cohortsFixture = [
  {
    id: '9b-algebra',
    name: '9-B Algebra',
    level: L2,
    subject: { uz: 'Algebra', ru: 'Алгебра', en: 'Algebra' },
    studentCount: 24,
    attendance: 94,
    up: 18,
    down: 4,
    next: { uz: 'Bugun · 09:00', ru: 'Сегодня · 09:00', en: 'Today · 09:00' },
    color: 'var(--sf-primary)',
    room: { uz: 'Xona 304', ru: 'Каб. 304', en: 'Room 304' },
  },
  {
    id: 'algebra-mid',
    name: 'Algebra Mid',
    level: L2,
    subject: { uz: 'Algebra', ru: 'Алгебра', en: 'Algebra' },
    studentCount: 21,
    attendance: 96,
    up: 14,
    down: 0,
    next: { uz: 'Bugun · 10:00', ru: 'Сегодня · 10:00', en: 'Today · 10:00' },
    color: 'var(--sf-primary)',
    room: { uz: 'Xona 304', ru: 'Каб. 304', en: 'Room 304' },
  },
  {
    id: '10v-geometriya',
    name: '10-V Geometriya',
    level: L3,
    subject: { uz: 'Geometriya', ru: 'Геометрия', en: 'Geometry' },
    studentCount: 19,
    attendance: 88,
    up: 9,
    down: 3,
    next: { uz: 'Bugun · 11:30', ru: 'Сегодня · 11:30', en: 'Today · 11:30' },
    color: 'var(--sf-accent)',
    room: { uz: 'Xona 301', ru: 'Каб. 301', en: 'Room 301' },
  },
];

export const rosterFixture = {
  '9b-algebra': [
    { id: 's1', name: 'Akbarov Akmal', studentId: 'DEMO-2026-00042', up: 8, down: 0, attendance: 96, flag: 'top' },
    { id: 's2', name: 'Azizova Madina', studentId: 'DEMO-2026-00043', up: 6, down: 0, attendance: 98, flag: 'top' },
    { id: 's3', name: 'Bakirov Sherzod', studentId: 'DEMO-2026-00044', up: 2, down: 2, attendance: 88, flag: null },
    { id: 's4', name: 'Davronova Sevinch', studentId: 'DEMO-2026-00045', up: 4, down: 0, attendance: 92, flag: null },
    { id: 's5', name: 'Eshmatov Otabek', studentId: 'DEMO-2026-00046', up: 1, down: 4, attendance: 72, flag: 'warn' },
    { id: 's6', name: 'Halimova Zilola', studentId: 'DEMO-2026-00047', up: 7, down: 0, attendance: 95, flag: 'top' },
  ],
};
