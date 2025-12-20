/**
 * Main entry point for common functionality across all pages
 * Initializes core UI components when the DOM is ready
 * 
 * @module main
 * @author Texas Tough Rentals
 */

import { initMobileMenu } from './components/mobile-menu.js';
import { initBackToTop } from './components/back-to-top.js';

/**
 * Initialize all common components when DOM is fully loaded
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBackToTop();
});
