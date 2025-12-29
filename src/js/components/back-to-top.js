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
