export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const mobileNav = document.getElementById('mobile-nav');
  
  // Early return if required elements are not found
  if (!mobileMenuBtn || !mobileNav) return;
  
  // Toggle menu visibility
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileNav.classList.toggle('hidden');
  });
  
  // Close mobile menu when clicking any navigation link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.classList.contains('hidden') && 
        !mobileNav.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
      mobileNav.classList.add('hidden');
    }
  });
}
