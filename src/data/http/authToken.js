// Bearer-token holder + session bootstrap for the HTTP data layer.
//
// The teacher app has no login screen; it auto-establishes a real session with
// the seeded demo teacher on first call, so logout/devices/etc. are backed by a
// real JWT + server session (not a cosmetic flag). Swap `DEMO_CREDENTIALS` for a
// real login form later — nothing else changes.

const STORAGE_KEY = 'sf-token';
const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? '';
const DEMO_CREDENTIALS = { username: 'nigora.karimova', password: 'demo1234' };

let token = readStored();
let inflight = null;

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function getToken() {
  return token;
}

export function setToken(next) {
  token = next || null;
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable — keep in memory */
  }
}

export function clearToken() {
  setToken(null);
}

/** Ensure a valid session exists, logging in (once, de-duped) if needed. */
export async function ensureSession() {
  if (token) return token;
  if (inflight) return inflight;
  inflight = (async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_CREDENTIALS),
    });
    if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
    const data = await res.json();
    setToken(data.token);
    return data.token;
  })();
  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
