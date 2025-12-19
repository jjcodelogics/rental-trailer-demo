// Main entry point for common functionality
import { initMobileMenu } from './components/mobile-menu.js';
import { initBackToTop } from './components/back-to-top.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBackToTop();
});
