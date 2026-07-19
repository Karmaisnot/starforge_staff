const text = (uz, ru, en) => ({ uz, ru, en });

function ago(days, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function buildFinanceFixture() {
  return {
    capabilities: {
      invoices: true,
      payments: true,
      expenses: true,
      shifts: true,
      collectCash: true,
    },
    invoices: [
      {
        id: 'inv-1048',
        number: 'INV-1048',
        student: 'Akbarov Akmal',
        cohort: '9-B Algebra',
        total: 1250000,
        allocated: 750000,
        status: 'issued',
        dueDate: ago(-2),
      },
      {
        id: 'inv-1047',
        number: 'INV-1047',
        student: 'Saidova Madina',
        cohort: 'Algebra Mid',
        total: 1250000,
        allocated: 1250000,
        status: 'paid',
        dueDate: ago(3),
      },
      {
        id: 'inv-1046',
        number: 'INV-1046',
        student: 'Karimov Diyor',
        cohort: '10-V Geometry',
        total: 1350000,
        allocated: 0,
        status: 'overdue',
        dueDate: ago(5),
      },
      {
        id: 'inv-1045',
        number: 'INV-1045',
        student: 'Toshpulatova Aziza',
        cohort: '9-B Algebra',
        total: 1250000,
        allocated: 500000,
        status: 'partial',
        dueDate: ago(1),
      },
    ],
    payments: [
      {
        id: 'pay-501',
        provider: 'cash',
        account: 'INV-1047',
        amount: 1250000,
        status: 'succeeded',
        paidAt: ago(0, 11),
      },
      {
        id: 'pay-500',
        provider: 'payme',
        account: 'INV-1048',
        amount: 750000,
        status: 'succeeded',
        paidAt: ago(0, 9),
      },
      {
        id: 'pay-499',
        provider: 'click',
        account: 'INV-1045',
        amount: 500000,
        status: 'succeeded',
        paidAt: ago(1, 16),
      },
    ],
    expenses: [
      {
        id: 'exp-91',
        category: text('Jihozlar', 'Оборудование', 'Equipment'),
        description: text(
          '204-xona uchun doska',
          'Доска для кабинета 204',
          'Whiteboard for room 204',
        ),
        amount: 650000,
        status: 'pending',
        createdAt: ago(0, 8),
      },
      {
        id: 'exp-90',
        category: text('Kantselyariya', 'Канцелярия', 'Stationery'),
        description: text('Iyul oyi materiallari', 'Материалы на июль', 'July supplies'),
        amount: 420000,
        status: 'paid',
        createdAt: ago(4),
      },
    ],
    shifts: [
      {
        id: 'shift-12',
        cashier: 'S. Mamatova',
        branch: 'Yunusobod',
        status: 'open',
        openedAt: ago(0, 8),
        openingCash: 2000000,
        closingCash: null,
        discrepancy: null,
      },
    ],
  };
}
