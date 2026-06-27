// admin-app.jsx — Shared router + providers for CEO/Manager/Audit web consoles.
// Each HTML entry sets window.SF_ROLE then calls mountAdmin().

function AdminApp({ role }) {
  const cfg = ROLE_CFG[role];
  const firstPage = cfg.nav[0].id;
  const [active, setActive] = React.useState(() => location.hash.replace('#', '') || firstPage);
  const [cur, setCur] = React.useState('UZS');

  React.useEffect(() => { location.hash = active; window.scrollTo({ top: 0 }); }, [active]);
  React.useEffect(() => {
    const onHash = () => setActive(location.hash.replace('#', '') || firstPage);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const onNav = (id) => setActive(id);

  // Route table — pages resolve per role. Unknown ids fall back to a stub.
  const render = () => {
    const p = active;
    // Shared
    if (p === 'settings') return <AdminSettingsPage role={role} />;
    if (p === 'students') return <StudentsPage role={role} onNav={onNav} />;
    if (p === 'groups') return <GroupsPage role={role} onNav={onNav} />;
    if (p === 'teachers') return <TeachersPage role={role} onNav={onNav} />;
    if (p === 'payments') return <PaymentsPage role={role} onNav={onNav} />;
    if (p === 'parents') return <ParentsPage role={role} onNav={onNav} />;
    if (p === 'chats') return <ChatsPage role={role} onNav={onNav} />;
    if (p === 'ai') return <AiPage role={role} onNav={onNav} />;
    if (p === 'permissions') return <PermissionsPage role={role} />;
    if (p === 'departments') return <DepartmentsPage role={role} />;
    if (p === 'hr') return <HRPage role={role} />;
    if (p === 'payroll') return <PayrollPage role={role} />;
    if (p === 'meetings') return <MeetingsPage role={role} />;
    if (p === 'messages') return <MessagesPage role={role} />;
    // CEO / Manager
    if (p === 'dash') return role === 'audit' ? <AuditDashPage onNav={onNav} /> : <DashboardPage role={role} onNav={onNav} />;
    if (p === 'branches') return <BranchesPage onNav={onNav} />;
    if (p === 'leads') return <LeadsPage />;
    if (p === 'enroll') return <EnrollPage role={role} />;
    if (p === 'approvals') return <ApprovalsPage />;
    if (p === 'schedule') return <SchedulePage />;
    // Audit
    if (p === 'anomalies') return <AnomaliesPage />;
    if (p === 'fairness') return <FairnessPage />;
    if (p === 'finance') return <FinanceAuditPage />;
    if (p === 'logs') return <LogsPage />;
    if (p === 'aiusage') return <AiUsagePage />;
    if (p === 'surveys') return <SurveyAuditPage />;
    if (p === 'cases') return <CasesPage />;
    return <div style={{ padding: 40, color: 'var(--sf-muted)' }}>Sahifa: {p}</div>;
  };

  return (
    <CurrencyCtx.Provider value={{ cur, setCur }}>
      <AdminShell role={role} active={active} onNav={onNav}>
        {render()}
      </AdminShell>
    </CurrencyCtx.Provider>
  );
}

function mountAdmin(role) {
  const nav = (ROLE_CFG[role].nav || []).map(n => ({ id: n.id, l: n.l, icon: n.icon }));
  const inner = <AdminApp role={role} />;
  ReactDOM.createRoot(document.getElementById('root')).render(
    window.SfControlProvider
      ? <SfControlProvider appId={'admin-' + role} defaultNav={nav} features={{ layout: false, reorder: false }} defaults={{ palette: role === 'audit' ? 'siyoh' : 'saroy', dark: role === 'audit' }}>{inner}</SfControlProvider>
      : inner
  );
}

window.mountAdmin = mountAdmin;
window.AdminApp = AdminApp;
