const T = {
  star: { uz: 'Yulduz karta', ru: 'Звёздная карта', en: 'Star card' },
  activity: { uz: 'Aktivlik', ru: 'Активность', en: 'Activity' },
  warning: { uz: 'Ogohlantirish', ru: 'Предупреждение', en: 'Warning' },
};

export const recentCardsFixture = [
  { id: 'c1', recipient: 'Akbarov Akmal', cohort: '9-B Algebra', typeName: T.star, kind: 'up', reason: { uz: 'Mustaqil yechim · 3-misol', ru: 'Самостоятельное решение · пример 3', en: 'Independent solution · problem 3' }, issuer: 'N.K.', when: '09:42' },
  { id: 'c2', recipient: 'Halimova Zilola', cohort: '9-B Algebra', typeName: T.activity, kind: 'up', reason: { uz: 'Sinfdoshlariga yordam berdi', ru: 'Помогла одноклассникам', en: 'Helped classmates' }, issuer: 'N.K.', when: '09:38' },
  { id: 'c3', recipient: 'Eshmatov Otabek', cohort: '9-B Algebra', typeName: T.warning, kind: 'down', reason: { uz: 'Uy ishi tayyor emas (2-marta)', ru: 'Домашка не готова (2-й раз)', en: 'Homework not ready (2nd time)' }, issuer: 'N.K.', when: { uz: '09:12', ru: '09:12', en: '09:12' } },
  { id: 'c4', recipient: 'Davronova Sevinch', cohort: 'Algebra · Mid', typeName: T.star, kind: 'up', reason: { uz: 'Toza daftar', ru: 'Аккуратная тетрадь', en: 'Tidy notebook' }, issuer: 'N.K.', when: { uz: 'Dush · 14:20', ru: 'Пн · 14:20', en: 'Mon · 14:20' } },
  { id: 'c5', recipient: 'Bakirov Sherzod', cohort: 'Algebra · Mid', typeName: T.warning, kind: 'down', reason: { uz: 'Darsda telefon bilan', ru: 'С телефоном на уроке', en: 'Phone during lesson' }, issuer: 'N.K.', when: { uz: 'Dush · 11:05', ru: 'Пн · 11:05', en: 'Mon · 11:05' } },
  { id: 'c6', recipient: 'Azizova Madina', cohort: '9-B Algebra', typeName: T.star, kind: 'up', reason: { uz: 'Olimpiada 2-bosqich', ru: 'Олимпиада, 2-й этап', en: 'Olympiad, round 2' }, issuer: 'N.K.', when: { uz: 'Yak · 18:40', ru: 'Вс · 18:40', en: 'Sun · 18:40' } },
];

export const cardTypesFixture = [
  { name: T.star, subtitle: { uz: 'Asosiy +', ru: 'Основной +', en: 'Primary +' }, kind: 'up', count: 5 },
  { name: T.activity, subtitle: { uz: 'Darsda ishtirok', ru: 'Участие в уроке', en: 'Class participation' }, kind: 'up', count: 3 },
  { name: { uz: 'Yordamchi', ru: 'Помощник', en: 'Helper' }, subtitle: { uz: 'Sinfdosh yordami', ru: 'Помощь однокласснику', en: 'Helping a classmate' }, kind: 'up', count: 2 },
  { name: { uz: 'Toza ish', ru: 'Аккуратность', en: 'Tidy work' }, subtitle: { uz: 'Daftar / vazifa', ru: 'Тетрадь / задание', en: 'Notebook / task' }, kind: 'up', count: 1 },
  { name: T.warning, subtitle: { uz: 'Asosiy −', ru: 'Основной −', en: 'Primary −' }, kind: 'down', count: 2 },
  { name: { uz: "Mas'uliyatsizlik", ru: 'Безответственность', en: 'Irresponsibility' }, subtitle: { uz: 'Uy ishi · kechikish', ru: 'Домашка · опоздание', en: 'Homework · lateness' }, kind: 'down', count: 1 },
];

export const cardStatsFixture = {
  upThisWeek: 11,
  downThisWeek: 3,
  recipients: 58,
  typeCount: 6,
  typeVersion: 'v2.3',
  upTrend: '+3',
};
