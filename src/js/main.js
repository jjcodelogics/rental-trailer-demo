import { initMobileMenu } from './components/mobile-menu.js';
import { initBackToTop } from './components/back-to-top.js';
import { initFaqAccordion } from './components/faq-accordion.js';
import { initTrailerCalculator } from './components/trailer-calculator.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBackToTop();
  initFaqAccordion();

  // Trailer calculator modal logic
  const openBtn = document.getElementById('open-calculator');
  const modal = document.getElementById('trailer-calculator-modal');
  const closeBtn = document.getElementById('close-calculator');
  const dropoffSelect = document.getElementById('dropoff');
  const pickupSelect = document.getElementById('pickup');
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
  
  // Show zipcode field if either drop off or pickup requires company service
  const toggleZipcodeField = () => {
    if ((dropoffSelect && dropoffSelect.value === 'company') || 
        (pickupSelect && pickupSelect.value === 'company')) {
      zipcodeGroup.classList.remove('hidden');
    } else {
      zipcodeGroup.classList.add('hidden');
    }
  };
  
  if (dropoffSelect && pickupSelect && zipcodeGroup) {
    dropoffSelect.addEventListener('change', toggleZipcodeField);
    pickupSelect.addEventListener('change', toggleZipcodeField);
  }
  initTrailerCalculator();
});
