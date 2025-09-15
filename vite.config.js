import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( ), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    watch: {
      ignored: ['**/*.json'],
    },
    // --- بداية الإضافة ---
    proxy: {
      // أي طلب يبدأ بـ /api سيتم توجيهه إلى الخادم الخلفي
      '/api': {
        target: 'http://localhost:3000', // عنوان الخادم الخلفي (json-server )
        changeOrigin: true, // ضروري للبروكسي الافتراضي
        rewrite: (path) => path.replace(/^\/api/, ''), // يزيل /api من بداية المسار قبل إرساله للخادم
      },
    },
  },
});
