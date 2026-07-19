export const DASHBOARD_WIDGET_KEYS = [
  'schedule',
  'recentCards',
  'pendingTasks',
  'printQueue',
  'spotlight',
  'activity',
];

const STORAGE_KEY = 'sf-dashboard-hidden-widgets';

export function readDashboardHiddenWidgets() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(
      DASHBOARD_WIDGET_KEYS.filter((key) => typeof saved[key] === 'boolean').map((key) => [
        key,
        saved[key],
      ]),
    );
  } catch {
    return {};
  }
}

export function saveDashboardHiddenWidgets(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* Ignore unavailable or full local storage. */
  }
}
