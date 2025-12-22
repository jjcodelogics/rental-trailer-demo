/**
 * FAQ Accordion Component
 * Handles the toggle functionality for FAQ questions
 * 
 * @module components/faq-accordion
 * @author Texas Tough Rentals
 */

/**
 * Initialize FAQ accordion functionality
 * Adds click handlers to all FAQ items to toggle their visibility
 */
export function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    if (!question || !answer || !icon) return;
    
    // Make question clickable
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
          if (otherIcon) otherIcon.textContent = 'expand_more';
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        icon.textContent = 'expand_more';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = 'expand_less';
      }
    });
  });
}
