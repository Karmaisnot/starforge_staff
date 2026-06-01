// Single source of truth for navigation — consumed by Sidebar, TopBar and MobileTabs.
// `badge` is the key into the nav-badges map; `urgent` drives the pulsing indicator.

export const PRIMARY_NAV = [
  { id: 'today', path: '/today', label: 'Bugun', icon: 'home' },
  { id: 'cohorts', path: '/cohorts', label: 'Guruhlar', icon: 'cohort' },
  { id: 'tasks', path: '/tasks', label: 'Vazifalar', icon: 'check', badge: 'tasks' },
  { id: 'ai', path: '/ai', label: 'AI Suhbat', icon: 'ai' },
  { id: 'print', path: '/print', label: 'Print', icon: 'print', badge: 'print' },
];

export const SECONDARY_NAV = [
  { id: 'cards', path: '/cards', label: 'Kartalar', icon: 'brand' },
  { id: 'surveys', path: '/surveys', label: "So'rovnomalar", icon: 'flag', badge: 'surveys', urgent: true },
  { id: 'mgmt', path: '/mgmt', label: 'Boshqaruv', icon: 'shield', badge: 'mgmt' },
  { id: 'materials', path: '/materials', label: 'Materiallar', icon: 'folder' },
  { id: 'notifications', path: '/notifications', label: 'Bildirishnomalar', icon: 'bell', badge: 'notif' },
];

export const SETTINGS_NAV = { id: 'settings', path: '/settings', label: 'Sozlamalar', icon: 'settings' };

export const ALL_NAV = [...PRIMARY_NAV, ...SECONDARY_NAV, SETTINGS_NAV];
