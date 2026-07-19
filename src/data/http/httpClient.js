// Contract-aware fetch wrapper for the Starforge tenant API.
// The backend envelopes successes as { success: true, data } and errors as
// { success: false, code, message, errors? }. Repositories receive only data.
import { deepLocalize, getLocale } from '@/i18n/locale.js';
import { apiUrl } from './apiConfig.js';
import { ApiError } from './apiError.js';
import { clearToken, getToken } from './authToken.js';

export class HttpError extends ApiError {}

const RETRY_DELAYS_MS = [250, 700];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readPayload(response) {
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

function unwrapSuccess(payload) {
  if (payload && payload.success === true && Object.hasOwn(payload, 'data')) return payload.data;
  return payload;
}

function buildHeaders(body, token, extraHeaders) {
  const headers = new Headers(extraHeaders);
  headers.set('Accept-Language', getLocale());
  if (body != null) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function fetchWithRetry(url, init, retryable) {
  let lastNetworkError = null;
  const attempts = retryable ? RETRY_DELAYS_MS.length + 1 : 1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.status < 500 || attempt === attempts - 1) return response;
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      lastNetworkError = error;
      if (attempt === attempts - 1) throw error;
    }
    await sleep(RETRY_DELAYS_MS[attempt]);
  }

  throw lastNetworkError ?? new Error('Network request failed.');
}

async function request(
  path,
  { method = 'GET', body, headers, auth = true, signal, retry = true } = {},
) {
  const token = auth ? getToken() : null;
  if (auth && !token) {
    clearToken();
    throw new HttpError(401, method, path, {
      code: 'authentication_failed',
      message: 'Your session has ended. Please sign in again.',
    });
  }

  const normalizedMethod = method.toUpperCase();
  const response = await fetchWithRetry(
    apiUrl(path),
    {
      method: normalizedMethod,
      headers: buildHeaders(body, token, headers),
      body: body != null ? JSON.stringify(body) : undefined,
      signal,
    },
    normalizedMethod === 'GET' && retry,
  );
  const payload = await readPayload(response);

  if (!response.ok || payload?.success === false) {
    const error = new HttpError(
      response.status,
      normalizedMethod,
      path,
      payload,
      response.headers.get('Retry-After'),
    );
    // There is deliberately no refresh/retry flow for this API. A lost session
    // is terminal and the route guard will take the user back to sign-in.
    if (error.status === 401 && error.code === 'authentication_failed') clearToken();
    throw error;
  }

  return deepLocalize(unwrapSuccess(payload), getLocale());
}

export const httpClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
