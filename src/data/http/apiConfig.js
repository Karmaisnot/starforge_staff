// Central API configuration. In production the SPA is served by the tenant host,
// so an empty base URL deliberately keeps requests same-origin. During local
// development Vite can proxy the same relative /api path to a tenant backend.

const rawBaseUrl = import.meta.env?.VITE_API_BASE_URL ?? '';

export const API_PREFIX = '/api/v1';
export const API_MODE = import.meta.env?.VITE_USE_MOCK === 'false';

const baseUrl = rawBaseUrl.replace(/\/+$/, '');
const baseAlreadyVersioned = baseUrl.endsWith(API_PREFIX);

function normalizePath(path) {
  const value = String(path ?? '');
  if (value.startsWith(`${API_PREFIX}/`) || value === API_PREFIX) return value;
  return `${API_PREFIX}/${value.replace(/^\/+/, '')}`;
}

/** Resolve a versioned tenant API path against the configured origin. */
export function apiUrl(path) {
  const normalized = normalizePath(path);
  // Accept either a tenant origin (`https://tenant.example`) or a fully
  // versioned base (`https://tenant.example/api/v1`) in VITE_API_BASE_URL.
  return `${baseUrl}${baseAlreadyVersioned ? normalized.slice(API_PREFIX.length) : normalized}`;
}

/** True only when the application is intentionally configured for live data. */
export function isApiMode() {
  return API_MODE;
}
