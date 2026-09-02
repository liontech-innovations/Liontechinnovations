import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createReadStream, existsSync } from 'node:fs';
import {defineConfig, loadEnv} from 'vite';

const careOpsPublicEnvVars = [
  'NEXT_PUBLIC_STRIPE_CAREOPS_AUDIT_URL',
  'NEXT_PUBLIC_STRIPE_CAREOPS_IMPLEMENTATION_URL',
  'NEXT_PUBLIC_STRIPE_CAREOPS_MONITORING_URL',
  'NEXT_PUBLIC_STRIPE_CAREOPS_COMMAND_SETUP_URL',
  'NEXT_PUBLIC_STRIPE_CAREOPS_COMMAND_MONTHLY_URL',
  'NEXT_PUBLIC_STRIPE_CAREOPS_FOUNDING_PACKAGE_URL',
  'NEXT_PUBLIC_STRIPE_CAREOPS_COMMAND_RECOVERY_MONITORING_URL',
];

export default defineConfig(({mode, command}) => {
  if (mode === 'founder-review' && command === 'build') throw new Error('Founder-review mode contains preview-only licensed imagery and cannot be built for release.');
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), ...(mode === 'founder-review' ? [{
      name: 'local-founder-review-image',
      configureServer(server) {
        server.middlewares.use('/__founder-review/banknotes.jpg', (_request, response) => {
          const file = path.resolve(__dirname, 'artifacts/zimbabwe-page/preview-only/banknotes.jpg');
          response.setHeader('Cache-Control', 'no-store');
          if (!existsSync(file)) { response.statusCode = 404; response.end('Founder preview asset not installed'); return; }
          response.setHeader('Content-Type', 'image/jpeg');
          createReadStream(file).pipe(response);
        });
      },
    }] : [])],
    define: {
      ...Object.fromEntries(
        careOpsPublicEnvVars.map((key) => [
          `process.env.${key}`,
          JSON.stringify(env[key] || ''),
        ]),
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: { hmr: true },
  };
});
