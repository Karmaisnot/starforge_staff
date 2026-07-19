import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useTeacher } from '@/hooks/data.js';
import { useT } from '@/hooks/useT.js';
import { ALL_NAV } from './navConfig.js';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { MobileTabs } from './MobileTabs.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { StaffOnlyPage } from '@/app/StaffOnlyPage.jsx';
import { RouteAccessPage } from '@/app/StaffOnlyPage.jsx';
import { PageError, PageLoading } from './PageState.jsx';
import styles from './AppShell.module.css';

/** Responsive application chrome: sidebar / topbar / mobile tabs around the routed page. */
export function AppShell() {
  const [drawer, setDrawer] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();
  const { t, locale, setLocale } = useT();
  const { ai, navigation } = useServices();

  // Global ⌘K / Ctrl+K opens the command palette from anywhere in the app.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const teacherState = useTeacher();
  const teacher = teacherState.data;
  const languageHydrated = useRef(false);
  useEffect(() => {
    if (!teacher || languageHydrated.current) return;
    languageHydrated.current = true;
    if (teacher.preferredLanguage && teacher.preferredLanguage !== locale) {
      setLocale(teacher.preferredLanguage);
    }
  }, [teacher, locale, setLocale]);
  const { data: badges } = useAsync(
    () => (teacher ? navigation.getBadges() : Promise.resolve({})),
    [teacher?.id],
  );
  const { data: aiUsage } = useAsync(
    () => (teacher?.roleKey === 'teacher' ? ai.getUsage() : Promise.resolve(null)),
    [teacher?.roleKey],
  );

  const current = ALL_NAV.find((n) => pathname.startsWith(n.path));
  const title = current ? t(`nav.${current.id}`) : 'StarForge';

  // Fail closed while the authenticated identity is unknown. Otherwise a
  // transient /users/me/ failure would briefly expose every role-gated route.
  if (!teacher) {
    return (
      <main className={styles.gate}>
        {teacherState.loading ? <PageLoading /> : <PageError error={teacherState.error} />}
      </main>
    );
  }

  if (['director', 'head_of_dept'].includes(teacher?.roleKey)) {
    return <StaffOnlyPage profile={teacher} />;
  }

  if (current?.roles && !current.roles.includes(teacher.roleKey)) {
    return <RouteAccessPage profile={teacher} />;
  }

  return (
    <div className={styles.root}>
      <Sidebar
        teacher={teacher}
        badges={badges ?? {}}
        aiUsage={aiUsage}
        open={drawer}
        onClose={() => setDrawer(false)}
      />
      {drawer && <div className={styles.scrim} onClick={() => setDrawer(false)} />}

      <div className={styles.col}>
        <TopBar
          title={title}
          teacher={teacher}
          onOpenDrawer={() => setDrawer(true)}
          onOpenSearch={() => setPaletteOpen(true)}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <MobileTabs badges={badges ?? {}} profile={teacher} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} profile={teacher} />
    </div>
  );
}
