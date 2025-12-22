/**
 * Main entry point for common functionality across all pages
 * Initializes core UI components when the DOM is ready
 * 
 * @module main
 * @author Texas Tough Rentals
 */

import { initMobileMenu } from './components/mobile-menu.js';
import { initBackToTop } from './components/back-to-top.js';
import { initFaqAccordion } from './components/faq-accordion.js';
import { initTrailerCalculator } from './components/trailer-calculator.js';

/**
 * Initialize all common components when DOM is fully loaded
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBackToTop();
  initFaqAccordion();

  // Trailer calculator modal logic
  const openBtn = document.getElementById('open-calculator');
  const modal = document.getElementById('trailer-calculator-modal');
  const closeBtn = document.getElementById('close-calculator');
  const deliverySelect = document.getElementById('delivery');
  const zipcodeGroup = document.getElementById('zipcode-group');

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  }
  if (deliverySelect && zipcodeGroup) {
    deliverySelect.addEventListener('change', (e) => {
      if (deliverySelect.value === 'delivery') {
        zipcodeGroup.classList.remove('hidden');
      } else {
        zipcodeGroup.classList.add('hidden');
      }
    });
  }
  initTrailerCalculator();
});
