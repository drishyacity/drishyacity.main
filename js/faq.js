/**
 * FAQ Page Functionality
 * Handles accordion behavior for FAQ items
 */

class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-accordion-item');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    this.toggleFAQ(item, question, answer);
                });
            }
        });
    }

    setupKeyboardNavigation() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                // Make questions focusable
                question.setAttribute('tabindex', '0');
                
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const answer = item.querySelector('.faq-answer');
                        this.toggleFAQ(item, question, answer);
                    }
                });
            }
        });
    }

    toggleFAQ(item, question, answer) {
        const isOpen = item.classList.contains('active');
        const icon = question.querySelector('i');
        
        if (isOpen) {
            // Close the FAQ
            item.classList.remove('active');
            answer.style.maxHeight = null;
            answer.style.paddingTop = '0';
            answer.style.paddingBottom = '0';
            
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
            
            // Update ARIA attributes
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
        } else {
            // Close other open FAQs (optional - remove if you want multiple open)
            this.closeAllFAQs();
            
            // Open this FAQ
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.paddingTop = '1.5rem';
            answer.style.paddingBottom = '1.5rem';
            
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
            }
            
            // Update ARIA attributes
            question.setAttribute('aria-expanded', 'true');
            answer.setAttribute('aria-hidden', 'false');
        }
    }

    closeAllFAQs() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            item.classList.remove('active');
            answer.style.maxHeight = null;
            answer.style.paddingTop = '0';
            answer.style.paddingBottom = '0';
            
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
            
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
        });
    }

    // Method to open a specific FAQ (useful for deep linking)
    openFAQ(index) {
        if (this.faqItems[index]) {
            const item = this.faqItems[index];
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                this.toggleFAQ(item, question, answer);
                
                // Scroll to the FAQ item
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }
}

// Initialize FAQ accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const faqAccordion = new FAQAccordion();
    
    // Check for URL hash to open specific FAQ
    const hash = window.location.hash;
    if (hash && hash.startsWith('#faq-')) {
        const faqNumber = parseInt(hash.replace('#faq-', ''));
        if (!isNaN(faqNumber) && faqNumber > 0) {
            // Small delay to ensure everything is loaded
            setTimeout(() => {
                faqAccordion.openFAQ(faqNumber - 1);
            }, 100);
        }
    }
    
    // Make FAQ accordion globally accessible
    window.faqAccordion = faqAccordion;
});

// Add smooth scrolling for FAQ links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#faq-"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Open the FAQ if it's not already open
            const faqItem = targetElement.closest('.faq-accordion-item');
            if (faqItem && !faqItem.classList.contains('active')) {
                const question = faqItem.querySelector('.faq-question');
                if (question) {
                    question.click();
                }
            }
        }
    }
});
