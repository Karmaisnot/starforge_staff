// Fetch wrapper for the Http* repositories.
//  - Base URL from Vite env (VITE_API_BASE_URL); empty = same-origin (dev proxy).
//  - Attaches the bearer token and auto-establishes a session on first use.
//  - Resolves localized {uz,ru,en} leaves to the active locale on the way out,
//    exactly like the mock layer's deepLocalize — so pages see identical data.
import { deepLocalize, getLocale } from '@/i18n/locale.js';
import { ensureSession, getToken, clearToken } from './authToken.js';

const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? '';

/** Error carrying the HTTP status so callers can branch (e.g. 404 -> null). */
export class HttpError extends Error {
  constructor(status, method, path, body) {
    super(`HTTP ${status} ${method} ${path}`);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

async function rawFetch(path, method, body, token) {
  const headers = {};
  // Only declare a JSON content-type when there's actually a body — a bare
  // PATCH/DELETE with Content-Type: application/json and no body is rejected.
  if (body != null) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

async function request(path, { method = 'GET', body } = {}) {
  const isAuthCall = path.startsWith('/api/auth/');
  let token = isAuthCall ? getToken() : await ensureSession();

  let res = await rawFetch(path, method, body, token);

  // Token expired/invalid — drop it, re-establish a session once, retry.
  if (res.status === 401 && !isAuthCall) {
    clearToken();
    token = await ensureSession();
    res = await rawFetch(path, method, body, token);
  }

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      /* no JSON body */
    }
    throw new HttpError(res.status, method, path, payload);
  }

  if (res.status === 204) return null;
  const data = await res.json();
  return deepLocalize(data, getLocale());
}

export const httpClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
