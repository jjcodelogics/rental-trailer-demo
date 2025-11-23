import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        inquiry: path.resolve(__dirname, 'inquiry.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
