import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Path alias `@` -> `src` keeps imports flat across the layered architecture.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // The SPA normally talks to its tenant origin. In local development, proxy
  // those same relative /api requests to the supplied tenant host to avoid CORS.
  // The supplied tenant redirects HTTP to HTTPS. Point the dev proxy at the
  // canonical origin so browser requests do not receive a cross-origin 308.
  const apiTarget = env.VITE_API_PROXY_TARGET || 'https://starforge.78.111.91.113.nip.io';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
