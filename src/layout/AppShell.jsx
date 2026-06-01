import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useServices } from '@/hooks/useServices.js';
import { useAsync } from '@/hooks/useAsync.js';
import { useTeacher, useNavBadges } from '@/hooks/data.js';
import { useT } from '@/hooks/useT.js';
import { ALL_NAV } from './navConfig.js';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { MobileTabs } from './MobileTabs.jsx';
import styles from './AppShell.module.css';

/** Responsive application chrome: sidebar / topbar / mobile tabs around the routed page. */
export function AppShell() {
  const [drawer, setDrawer] = useState(false);
  const { pathname } = useLocation();
  const { t } = useT();
  const { ai } = useServices();

  const { data: teacher } = useTeacher();
  const { data: badges } = useNavBadges();
  const { data: aiUsage } = useAsync(() => ai.getUsage(), []);

  const current = ALL_NAV.find((n) => pathname.startsWith(n.path));
  const title = current ? t(`nav.${current.id}`) : 'StarForge';

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
        <TopBar title={title} teacher={teacher} onOpenDrawer={() => setDrawer(true)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <MobileTabs badges={badges ?? {}} />
    </div>
  );
}
