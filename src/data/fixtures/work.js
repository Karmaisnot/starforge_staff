const text = (uz, ru, en) => ({ uz, ru, en });

function atDay(offset, hour, minute = 0) {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1 + offset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function buildWorkFixture() {
  return {
    capabilities: {
      schedule: true,
      meetings: true,
      requests: true,
      loans: true,
      cover: true,
    },
    lessons: [
      {
        id: 'lesson-1',
        title: text('Chiziqli tenglamalar', 'Линейные уравнения', 'Linear equations'),
        cohort: '9-B Algebra',
        type: text('Asosiy dars', 'Основной урок', 'Core lesson'),
        room: '204',
        startsAt: atDay(0, 9),
        endsAt: atDay(0, 10, 20),
        status: 'scheduled',
        color: 'var(--sf-primary)',
      },
      {
        id: 'lesson-2',
        title: text('Funksiyalar grafigi', 'Графики функций', 'Function graphs'),
        cohort: 'Algebra Mid',
        type: text('Amaliyot', 'Практика', 'Workshop'),
        room: '108',
        startsAt: atDay(1, 11),
        endsAt: atDay(1, 12, 20),
        status: 'scheduled',
        color: 'var(--sf-accent)',
      },
      {
        id: 'lesson-3',
        title: text('Uchburchaklar', 'Треугольники', 'Triangles'),
        cohort: '10-V Geometry',
        type: text('Video dars', 'Видео-урок', 'Video lesson'),
        room: '302',
        startsAt: atDay(3, 14),
        endsAt: atDay(3, 15, 20),
        status: 'scheduled',
        color: 'var(--sf-success)',
      },
      {
        id: 'lesson-4',
        title: text('Haftalik tekshiruv', 'Недельная проверка', 'Weekly review'),
        cohort: '9-B Algebra',
        type: text('Nazorat', 'Проверка', 'Review'),
        room: '204',
        startsAt: atDay(4, 10),
        endsAt: atDay(4, 11, 20),
        status: 'scheduled',
        color: 'var(--sf-primary)',
      },
    ],
    meetings: [
      {
        id: 'meeting-1',
        title: text('Akademik haftalik', 'Академический еженедельник', 'Academic weekly'),
        agenda: text(
          'Davomat, imtihon tayyorgarligi va guruh xavflari.',
          'Посещаемость, подготовка к экзаменам и риски групп.',
          'Attendance, exam preparation and group risks.',
        ),
        location: text('Majlis xonasi', 'Переговорная', 'Meeting room'),
        startsAt: atDay(2, 15),
        endsAt: atDay(2, 15, 45),
        status: 'scheduled',
        response: 'pending',
      },
      {
        id: 'meeting-2',
        title: text('Yozgi tadbir brifingi', 'Брифинг летнего события', 'Summer event briefing'),
        agenda: text('Vazifalar va vaqt jadvali.', 'Роли и график.', 'Roles and timeline.'),
        location: text('Kutubxona', 'Библиотека', 'Library'),
        startsAt: atDay(7, 9),
        endsAt: atDay(7, 9, 30),
        status: 'scheduled',
        response: 'accepted',
      },
    ],
    requests: [
      {
        id: 'request-1',
        kind: 'expense',
        title: text('Geometriya to‘plamlari', 'Наборы для геометрии', 'Geometry kits'),
        description: text(
          '10-V guruhi uchun uchta sinf to‘plami.',
          'Три классных набора для группы 10-В.',
          'Three classroom sets for group 10-V.',
        ),
        amount: 780000,
        status: 'pending',
        createdAt: atDay(-2, 12),
      },
      {
        id: 'request-2',
        kind: 'other',
        title: text('Metodik kun', 'Методический день', 'Methodology day'),
        description: text(
          'Avgust seminarida ishtirok etish.',
          'Участие в августовском семинаре.',
          'Attend the August teaching workshop.',
        ),
        amount: null,
        status: 'approved',
        createdAt: atDay(-5, 10),
      },
      {
        id: 'request-3',
        kind: 'loan',
        title: text('Xodim avansi', 'Аванс сотруднику', 'Staff advance'),
        description: text('Shaxsiy so‘rov.', 'Личный запрос.', 'Personal request.'),
        amount: 2500000,
        outstanding: 1500000,
        status: 'disbursed',
        createdAt: atDay(-9, 9),
      },
    ],
    coverage: [
      {
        id: 'cover-1',
        lessonId: 'pool-lesson-1',
        lessonTitle: text('Speaking club · B2', 'Разговорный клуб · B2', 'Speaking club · B2'),
        time: atDay(2, 17),
        reason: text(
          'O‘qituvchi treningda.',
          'Преподаватель на тренинге.',
          'Teacher is in training.',
        ),
        status: 'open',
        pool: true,
      },
      {
        id: 'cover-2',
        lessonId: 'pool-lesson-2',
        lessonTitle: text('Foundation Math', 'Базовая математика', 'Foundation Math'),
        time: atDay(4, 13),
        reason: text('Tibbiy ko‘rik.', 'Медицинский приём.', 'Medical appointment.'),
        status: 'open',
        pool: true,
      },
    ],
  };
}
