/**
 * Back to Top Button Component
 * Manages the visibility and behavior of the scroll-to-top button
 * 
 * @module components/back-to-top
 */

/**
 * Initializes the back-to-top button functionality
 * Shows/hides button based on scroll position (threshold: 300px)
 * 
 * @function initBackToTop
 * @returns {void}
 * @example
 * // Initialize on page load
 * initBackToTop();
 */
export function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  // Early return if button element doesn't exist
  if (!backToTopBtn) return;
  
  const SCROLL_THRESHOLD = 300; // px
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  });
}
