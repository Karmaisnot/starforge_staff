import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SessionGate } from '@/app/SessionGate.jsx';
import { RouteErrorPage } from '@/app/RouteErrorPage.jsx';
import { AppShell } from '@/layout/AppShell.jsx';
import { LoginPage } from '@/features/auth/LoginPage.jsx';
import { TodayPage } from '@/features/today/TodayPage.jsx';
import { CohortsPage } from '@/features/cohorts/CohortsPage.jsx';
import { TasksPage } from '@/features/tasks/TasksPage.jsx';
import { AiPage } from '@/features/ai/AiPage.jsx';
import { PrintPage } from '@/features/print/PrintPage.jsx';
import { SurveysPage } from '@/features/surveys/SurveysPage.jsx';
import { MgmtPage } from '@/features/mgmt/MgmtPage.jsx';
import { CardsPage } from '@/features/cards/CardsPage.jsx';
import { MaterialsPage } from '@/features/materials/MaterialsPage.jsx';
import { NotificationsPage } from '@/features/notifications/NotificationsPage.jsx';
import { SettingsPage } from '@/features/settings/SettingsPage.jsx';

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <SessionGate />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/today" replace /> },
          { path: 'today', element: <TodayPage /> },
          { path: 'cohorts', element: <CohortsPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'ai', element: <AiPage /> },
          { path: 'print', element: <PrintPage /> },
          { path: 'surveys', element: <SurveysPage /> },
          { path: 'mgmt', element: <MgmtPage /> },
          { path: 'cards', element: <CardsPage /> },
          { path: 'materials', element: <MaterialsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/today" replace /> },
        ],
      },
    ],
  },
]);
