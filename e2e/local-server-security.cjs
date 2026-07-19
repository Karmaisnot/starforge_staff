// Regression guard for the legacy Fastify service: a logged-out JWT must not
// remain usable merely because its signature and expiry are still valid.
const BASE = process.env.LOCAL_SERVER_URL || 'http://127.0.0.1:4000/api';

(async () => {
  const login = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'starforge-security-regression' },
    body: JSON.stringify({
      username: 'nigora.karimova',
      password: 'demo1234',
      platform: 'web',
    }),
  });
  if (!login.ok) throw new Error(`Seeded login failed with ${login.status}`);
  const { token } = await login.json();
  if (!token) throw new Error('Login response did not contain a token');

  const headers = { authorization: `Bearer ${token}` };
  const before = await fetch(`${BASE}/account/teacher`, { headers });
  if (!before.ok) throw new Error(`Fresh token was rejected with ${before.status}`);

  const logout = await fetch(`${BASE}/auth/logout`, { method: 'POST', headers });
  if (!logout.ok) throw new Error(`Logout failed with ${logout.status}`);

  const after = await fetch(`${BASE}/account/teacher`, { headers });
  if (after.status !== 401) {
    throw new Error(`Revoked JWT remained usable; expected 401, received ${after.status}`);
  }

  process.stdout.write('PASS logout revokes the server-side JWT session\n');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
