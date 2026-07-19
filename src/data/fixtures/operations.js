const text = (uz, ru, en) => ({ uz, ru, en });

export const operationsFixture = {
  capabilities: {
    rewards: true,
    rules: true,
    procurement: true,
    sales: true,
    campaigns: true,
    audit: true,
    access: true,
  },
  rewards: [
    { id: 'rw-1', name: text('Jamoaviy yordam', 'Помощь команде', 'Team support'), description: text('Hamkasblarga faol yordam', 'Активная помощь коллегам', 'Active support for colleagues'), cash: false, amount: 0 },
    { id: 'rw-2', name: text('Oy xodimi', 'Сотрудник месяца', 'Employee of the month'), description: text('Ajoyib umumiy natija', 'Выдающийся общий результат', 'Outstanding overall contribution'), cash: true, amount: 500000 },
  ],
  rules: [
    { id: 'rule-1', title: text('Ma\'lumotlar xavfsizligi', 'Безопасность данных', 'Data security'), version: '2.1', acknowledged: false, updatedAt: new Date().toISOString() },
    { id: 'rule-2', title: text('O\'quvchi bilan aloqa', 'Общение с учениками', 'Student communication'), version: '1.4', acknowledged: true, updatedAt: new Date().toISOString() },
  ],
  procurement: [
    { id: 'po-1', supplier: 'Office Line', amount: 2450000, status: 'approved', items: 4, createdAt: new Date().toISOString() },
    { id: 'po-2', supplier: 'Edu Lab', amount: 7180000, status: 'pending', items: 2, createdAt: new Date().toISOString() },
  ],
  sales: [
    { id: 'sale-1', item: text('Ish daftari', 'Рабочая тетрадь', 'Workbook'), quantity: 2, amount: 140000, status: 'completed', createdAt: new Date().toISOString() },
    { id: 'sale-2', item: text('Forma', 'Форма', 'Uniform'), quantity: 1, amount: 320000, status: 'completed', createdAt: new Date().toISOString() },
  ],
  campaigns: [
    { id: 'cmp-1', name: text('Yozgi qabul', 'Летний набор', 'Summer enrollment'), status: 'sent', total: 480, sent: 466, failed: 4, skipped: 10 },
  ],
  audit: [
    { id: 'audit-1', actor: 'registrar', action: 'student.updated', resource: 'student', createdAt: new Date().toISOString() },
    { id: 'audit-2', actor: 'cashier', action: 'payment.created', resource: 'payment', createdAt: new Date().toISOString() },
  ],
  access: {
    roles: 8,
    permissions: 74,
    overrides: 2,
  },
};
