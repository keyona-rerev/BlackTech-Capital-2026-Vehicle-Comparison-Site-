// js/main.js
/**
 * Main JavaScript for BlackTech Capital
 * Initializes page-specific functionality after components are loaded
 */

// Page-specific initialization
class PageController {
    constructor() {
        this.pageName = this.getPageName();
        this.init();
    }
    
    getPageName() {
        const bodyClasses = document.body.className.split(' ');
        const pageClass = bodyClasses.find(cls => cls.startsWith('page-'));
        return pageClass ? pageClass.replace('page-', '') : 'home';
    }
    
    async init() {
        // Wait for components to be ready
        document.addEventListener('components-ready', () => {
            this.initPageSpecificFeatures();
            this.setupEventListeners();
            this.enhanceAccessibility();
            this.trackAnalytics();
        });
    }
    
    initPageSpecificFeatures() {
        switch (this.pageName) {
            case 'home':
                this.initHomePage();
                break;
            case 'catalyst-fund':
                this.initCatalystFundPage();
                break;
            case 'fund-i':
                this.initFundIPage();
                break;
            case 'opportunities':
                this.initOpportunitiesPage();
                break;
        }
    }
    
    initHomePage() {
        // Home page specific initialization
        this.setupHeroAnimations();
        this.setupStatsCounter();
    }
    
    initCatalystFundPage() {
        // Catalyst Fund page specific initialization
        this.setupFundDetails();
        this.setupInvestmentTable();
    }
    
    initFundIPage() {
        // Fund I page specific initialization
        this.setupPortfolioGrid();
        this.setupPerformanceCharts();
    }
    
    initOpportunitiesPage() {
        // Opportunities page specific initialization
        this.setupContactForm();
        this.setupFileUploads();
    }
    
    setupEventListeners() {
        // Common event listeners for all pages
        
        // Smooth scroll for anchor links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (link && link.hash) {
                event.preventDefault();
                const target = document.querySelector(link.hash);
                if (target) {
                    window.utils.smoothScroll(target);
                }
            }
        });
        
        // External link tracking
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="http"]');
            if (link && !link.href.includes(window.location.hostname)) {
                this.trackOutboundLink(link.href);
            }
        });
        
        // PDF download tracking
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href$=".pdf"]');
            if (link) {
                this.trackPDFDownload(link.href);
            }
        });
    }
    
    enhanceAccessibility() {
        // Add ARIA attributes and keyboard navigation enhancements
        
        // Add aria-labels to icons
        document.querySelectorAll('.fas, .fab').forEach(icon => {
            if (!icon.hasAttribute('aria-label') && !icon.closest('button, a')) {
                const iconClass = Array.from(icon.classList)
                    .find(cls => cls.startsWith('fa-'))
                    ?.replace('fa-', '');
                if (iconClass) {
                    icon.setAttribute('aria-label', iconClass);
                }
            }
        });
        
        // Focus trap for modals
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        // Implementation for modal focus trapping
        // This is a placeholder - implement when modals are added
    }
    
    setupHeroAnimations() {
        // Add animations to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    setupStatsCounter() {
        // Animated counter for statistics
        const counters = document.querySelectorAll('[data-counter]');
        if (counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            window.utils.setButtonLoading(submitButton, true);
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                this.showFormMessage(form, 'Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                form.reset();
                
                // Reset button
                window.utils.setButtonLoading(submitButton, false);
            }, 1500);
        });
    }
    
    showFormMessage(form, message, type = 'success') {
        // Remove existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message alert alert-${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        
        // Insert before form
        form.parentNode.insertBefore(messageEl, form);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
    
    trackOutboundLink(url) {
        // Send analytics data for outbound links
        console.log('Outbound link clicked:', url);
        // Implement your analytics tracking here
    }
    
    trackPDFDownload(url) {
        // Send analytics data for PDF downloads
        console.log('PDF downloaded:', url);
        // Implement your analytics tracking here
    }
    
    trackAnalytics() {
        // Page view tracking
        console.log('Page viewed:', this.pageName);
        // Implement your analytics tracking here
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pageController = new PageController();
    });
} else {
    window.pageController = new PageController();
}
