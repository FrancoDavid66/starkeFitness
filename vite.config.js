import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // el catálogo (149 productos de 4 marcas) hace que el JS pese más de 500 kB: es normal
  build: { chunkSizeWarningLimit: 800 },
});
