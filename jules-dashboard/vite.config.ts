import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');
  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(cwd, './src') },
    },
    define: {
      // Maps JULES_API_KEY from your .env to the internal process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.JULES_API_KEY || env.VITE_API_KEY),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Links to existing Node.js backend
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});
