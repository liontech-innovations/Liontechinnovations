import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
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

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
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
