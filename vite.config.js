import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        trailer: path.resolve(__dirname, 'trailer.html'),
        about: path.resolve(__dirname, 'about-me.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        confirmBooking: path.resolve(__dirname, 'confirm-booking.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
