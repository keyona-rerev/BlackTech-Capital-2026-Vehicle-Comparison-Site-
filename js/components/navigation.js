// js/components/navigation.js
class Navigation {
    constructor() {
        this.navToggle = null;
        this.navMenu = null;
        this.isOpen = false;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleEscape = this.handleEscape.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }
    
    init() {
        // Wait for components to be loaded
        document.addEventListener('components-ready', () => {
            this.setupNavigation();
        });
    }
    
    setupNavigation() {
        // Get navigation elements
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.primary-nav');
        
        if (!this.navToggle || !this.navMenu) {
            console.warn('Navigation elements not found');
            return;
        }
        
        // Set initial state
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
        
        // Add event listeners
        this.navToggle.addEventListener('click', this.toggleMenu);
        
        // Close menu on escape key
        document.addEventListener('keydown', this.handleEscape);
        
        // Close menu when clicking outside
        document.addEventListener('click', this.handleClickOutside);
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize);
        
        // Handle keyboard navigation in menu
        this.setupKeyboardNavigation();
        
        console.log('Navigation initialized');
    }
    
    toggleMenu(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        this.isOpen = !this.isOpen;
        
        // Update toggle button
        this.navToggle.setAttribute('aria-expanded', this.isOpen.toString());
        this.navToggle.classList.toggle('is-active', this.isOpen);
        
        // Update menu
        this.navMenu.setAttribute('aria-hidden', (!this.isOpen).toString());
        this.navMenu.classList.toggle('is-open', this.isOpen);
        
        // Update body class for potential styling
        document.body.classList.toggle('nav-open', this.isOpen);
        
        // Focus management
        if (this.isOpen) {
            // Focus first link in menu when opening
            const firstLink = this.navMenu.querySelector('a');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        } else {
            // Return focus to toggle button when closing
            this.navToggle.focus();
        }
    }
    
    closeMenu() {
        if (this.isOpen) {
            this.isOpen = false;
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navToggle.classList.remove('is-active');
            this.navMenu.setAttribute('aria-hidden', 'true');
            this.navMenu.classList.remove('is-open');
            document.body.classList.remove('nav-open');
        }
    }
    
    handleEscape(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this.closeMenu();
        }
    }
    
    handleClickOutside(event) {
        if (this.isOpen && 
            !this.navToggle.contains(event.target) && 
            !this.navMenu.contains(event.target)) {
            this.closeMenu();
        }
    }
    
    handleResize() {
        // Close menu on larger screens (responsive behavior)
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }
    
    setupKeyboardNavigation() {
        const menuLinks = this.navMenu.querySelectorAll('a');
        
        if (menuLinks.length === 0) return;
        
        // Handle arrow key navigation
        this.navMenu.addEventListener('keydown', (event) => {
            const currentIndex = Array.from(menuLinks).indexOf(document.activeElement);
            
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    const nextIndex = (currentIndex + 1) % menuLinks.length;
                    menuLinks[nextIndex].focus();
                    break;
                    
                case 'ArrowUp':
                    event.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuLinks.length - 1;
                    menuLinks[prevIndex].focus();
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    menuLinks[0].focus();
                    break;
                    
                case 'End':
                    event.preventDefault();
                    menuLinks[menuLinks.length - 1].focus();
                    break;
            }
        });
        
        // Close menu when a link is clicked (for single page navigation)
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.closeMenu();
                }
            });
        });
    }
}

// Create global instance
window.navigation = new Navigation();

// Initialize navigation
window.navigation.init();
