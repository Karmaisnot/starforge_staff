// Demo teacher account. Display strings carry {uz,ru,en}; repos resolve to locale.
export const teacherFixture = {
  name: 'Nigora Karimova',
  role: { uz: 'Matematika ustozi', ru: 'Учитель математики', en: 'Mathematics teacher' },
  branch: {
    uz: 'Demo Akademiya · Yunusobod',
    ru: 'Demo Академия · Юнусобод',
    en: 'Demo Academy · Yunusobod',
  },
  username: 'nigora.karimova',
  subjects: [
    { uz: 'Algebra', ru: 'Алгебра', en: 'Algebra' },
    { uz: 'Geometriya', ru: 'Геометрия', en: 'Geometry' },
  ],
  summary: { cohorts: 3, students: 58, lessonsPerWeek: 12 },
};
