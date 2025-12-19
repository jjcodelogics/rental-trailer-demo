// Mobile Menu Toggle
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (!mobileMenuBtn || !mobileNav) return;
  
  mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });
  
  // Close mobile menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
    });
  });
}
