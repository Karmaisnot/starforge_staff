// staff-app.jsx — entry + router for the unified Staff app
const STAFF_PAGES = {
  today: (r, nav) => <StaffToday role={r} onNav={nav} />,
  enroll: (r) => <EnrollPage role={r} />,
  attendance: (r) => <StaffAttendance role={r} />,
  cards: (r) => <StaffCards role={r} />,
  groups: (r, nav) => <StaffGroups role={r} onNav={nav} />,
  materials: () => <StaffMaterials />,
  messages: () => <StaffMessages />,
  ai: (r) => <StaffAI role={r} />,
  teachers: () => <StaffTeachers />,
  reports: () => <StaffReports />,
  students: () => <StaffStudents />,
  leads: () => <StaffLeads />,
  payments: () => <StaffPayments />,
  auditdash: (r, nav) => <StaffAuditDash onNav={nav} />,
  anomalies: () => <StaffAnomalies />,
  logs: () => <StaffLogs />,
  cases: () => <StaffCases />,
  settings: (r) => <StaffSettings role={r} />,
};

// union of every role's nav (for the reorderable control + filtering)
function staffUnionNav() {
  const seen = {}, out = [];
  STAFF_ORDER.forEach(r => STAFF_ROLES[r].nav.forEach(n => { if (!seen[n.id]) { seen[n.id] = 1; out.push(n); } }));
  return out;
}

function StaffApp() {
  const [role, setRole] = React.useState('teacher');
  const [active, setActive] = React.useState('today');
  const onNav = (id) => { setActive(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const renderPage = (r, a, nav) => {
    const fn = STAFF_PAGES[a] || STAFF_PAGES[STAFF_ROLES[r].nav[0].id];
    return fn(r, nav);
  };
  const [cur, setCur] = React.useState('UZS');
  return (
    <CurrencyCtx.Provider value={{ cur, setCur }}>
      <style>{adminCommonStyles}</style>
      <style>{staffShellStyles}</style>
      <StaffShell role={role} setRole={setRole} active={active} onNav={onNav} renderPage={renderPage} />
    </CurrencyCtx.Provider>
  );
}

function mountStaff() {
  const nav = staffUnionNav();
  ReactDOM.createRoot(document.getElementById('root')).render(
    <SfControlProvider appId="staff" defaultNav={nav} defaults={{ palette: 'marvarid' }}>
      <StaffApp />
    </SfControlProvider>
  );
}
window.mountStaff = mountStaff;
Object.assign(window, { STAFF_PAGES });
