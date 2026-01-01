/**
 * Vite Configuration
 * Defines build settings, optimization, and development server configuration
 * 
 * @module vite.config
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // Remove console.log in production
        drop_debugger: true,     // Remove debugger statements
      },
      format: {
        comments: false  // Remove comments from production build
      }
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        trailer: path.resolve(__dirname, 'trailer.html'),
        about: path.resolve(__dirname, 'about-me.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        confirmBooking: path.resolve(__dirname, 'confirm-booking.html'),
        terms: path.resolve(__dirname, 'terms-and-conditions.html')
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: {
          'vendor': ['zod']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 3000,
    open: true
  }
});
