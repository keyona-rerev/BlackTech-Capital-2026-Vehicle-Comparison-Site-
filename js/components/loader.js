// js/components/loader.js
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.placeholders = new Map();
        this.cache = new Map();
        this.isReady = false;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.loadComponent = this.loadComponent.bind(this);
        this.loadAllComponents = this.loadAllComponents.bind(this);
        this.updateActiveStates = this.updateActiveStates.bind(this);
        this.updateCopyrightYear = this.updateCopyrightYear.bind(this);
    }
    
    async init() {
        try {
            // Find all component placeholders
            const placeholders = document.querySelectorAll('[data-component-placeholder]');
            
            // Store placeholder references
            placeholders.forEach(placeholder => {
                const componentName = placeholder.getAttribute('data-component-placeholder');
                this.placeholders.set(componentName, placeholder);
            });
            
            // Load all components
            await this.loadAllComponents();
            
            // Update dynamic content
            this.updateActiveStates();
            this.updateCopyrightYear();
            
            // Mark as ready
            this.isReady = true;
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('components-ready'));
            
            console.log('Components loaded successfully');
        } catch (error) {
            console.error('Failed to load components:', error);
            // Show fallback content (already in HTML)
        }
    }
    
    async loadAllComponents() {
        const loadPromises = [];
        
        for (const [name, placeholder] of this.placeholders) {
            loadPromises.push(this.loadComponent(name, placeholder));
        }
        
        await Promise.all(loadPromises);
    }
    
    async loadComponent(name, placeholder) {
        try {
            // Check cache first
            if (this.cache.has(name)) {
                this.insertComponent(name, placeholder, this.cache.get(name));
                return;
            }
            
            // Fetch component
            const response = await fetch(`components/${name}.html`);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${name}: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Cache the component
            this.cache.set(name, html);
            
            // Insert into placeholder
            this.insertComponent(name, placeholder, html);
            
        } catch (error) {
            console.error(`Error loading ${name}:`, error);
            // Keep the fallback content that's already in the placeholder
        }
    }
    
    insertComponent(name, placeholder, html) {
        // Clear placeholder content except fallback
        const fallback = placeholder.querySelector('.component-fallback');
        
        // Create wrapper div for component
        const componentWrapper = document.createElement('div');
        componentWrapper.className = `component component-${name}`;
        componentWrapper.innerHTML = html;
        
        // Insert before fallback
        if (fallback) {
            placeholder.insertBefore(componentWrapper, fallback);
            // Hide fallback content
            fallback.style.display = 'none';
        } else {
            placeholder.innerHTML = '';
            placeholder.appendChild(componentWrapper);
        }
        
        // Store reference
        this.components.set(name, componentWrapper);
    }
    
    updateActiveStates() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // Find all navigation links
        const navLinks = document.querySelectorAll('[data-nav-link]');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('/').pop();
            
            // Remove existing active class
            link.classList.remove('is-active');
            
            // Check if this link points to current page
            if (linkPage === currentPage) {
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
            
            // Special case for index.html
            if (currentPage === '' || currentPage === 'index.html') {
                if (linkHref === 'index.html' || linkHref === './') {
                    link.classList.add('is-active');
                    link.setAttribute('aria-current', 'page');
                }
            }
        });
    }
    
    updateCopyrightYear() {
        const yearElements = document.querySelectorAll('[data-current-year]');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
}

// Create global instance
window.componentLoader = new ComponentLoader();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.componentLoader.init();
    });
} else {
    window.componentLoader.init();
}
