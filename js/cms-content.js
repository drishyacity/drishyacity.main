/**
 * DrishyaCity CMS Content Loader
 * Handles loading and displaying content from markdown files
 */

class CMSContentLoader {
    constructor() {
        this.contentCache = new Map();
        this.portfolioItems = [];
        this.init();
    }

    async init() {
        try {
            await this.loadSiteSettings();
            await this.loadPageContent();
            await this.loadPortfolioItems();
            this.setupLazyLoading();
        } catch (error) {
            console.error('Error initializing CMS content:', error);
            this.fallbackToStaticContent();
        }
    }

    async loadSiteSettings() {
        try {
            const response = await fetch('/content/settings/site.md');
            if (response.ok) {
                const content = await response.text();
                const settings = this.parseMarkdownFrontmatter(content);
                this.applySiteSettings(settings);
            }
        } catch (error) {
            console.warn('Could not load site settings:', error);
        }
    }

    async loadPageContent() {
        // Skip page content loading to prevent duplication
        console.log('Using static page content');
        return;
    }

    async loadPortfolioItems() {
        // Load portfolio items from markdown files
        const portfolioFiles = [
            'brand-identity-suitking',
            'instagram-post-design-comparison',
            'youtube-thumbnail-design',
            'echo-tech-brand-logo',
            'food-poster-design'
        ];

        for (const file of portfolioFiles) {
            try {
                const response = await fetch(`/content/portfolio/${file}.md`);
                if (response.ok) {
                    const content = await response.text();
                    const portfolioData = this.parseMarkdownFrontmatter(content);
                    portfolioData.slug = file;
                    this.portfolioItems.push(portfolioData);
                }
            } catch (error) {
                console.warn(`Could not load portfolio item ${file}:`, error);
            }
        }

        // Add click handlers to existing portfolio items
        this.addPortfolioClickHandlers();
    }

    addPortfolioClickHandlers() {
        const portfolioLinks = document.querySelectorAll('.portfolio-link');
        portfolioLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const portfolioSlug = link.getAttribute('data-portfolio');
                if (portfolioSlug) {
                    const portfolioItem = this.portfolioItems.find(item => item.slug === portfolioSlug);
                    if (portfolioItem) {
                        this.openPortfolioModal(portfolioItem);
                    } else {
                        // Fallback for static content
                        this.openStaticPortfolioModal(link);
                    }
                }
            });
        });
    }

    openStaticPortfolioModal(link) {
        const portfolioItem = link.closest('.portfolio-item');
        const title = portfolioItem.querySelector('.portfolio-item-title').textContent;
        const category = portfolioItem.querySelector('.portfolio-item-category').textContent;
        const image = portfolioItem.querySelector('img').src;
        const alt = portfolioItem.querySelector('img').alt;

        const staticItem = {
            title: title,
            category: category.toLowerCase(),
            image: image,
            alt: alt,
            description: `${title} - ${category} design project`,
            body: ''
        };

        this.openPortfolioModal(staticItem);
    }

    parseMarkdownFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return { body: content };
        }

        const frontmatter = match[1];
        const body = match[2];
        
        // Simple YAML parser for frontmatter
        const data = { body: body.trim() };
        const lines = frontmatter.split('\n');
        
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                data[key] = value;
            }
        }
        
        return data;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'home';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        if (path.includes('portfolio')) return 'portfolio';
        if (path.includes('pricing')) return 'pricing';
        if (path.includes('faq')) return 'faq';
        if (path.includes('privacy')) return 'privacy-policy';
        return 'home';
    }

    applySiteSettings(settings) {
        // Update site title
        if (settings.title) {
            document.title = settings.title;
        }

        // Update meta description
        if (settings.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = settings.description;
        }

        // Update logo
        if (settings.logo) {
            const logos = document.querySelectorAll('.hero-logo, .nav-logo img');
            logos.forEach(logo => {
                if (logo.tagName === 'IMG') {
                    logo.src = settings.logo;
                }
            });
        }

        // Update social links
        if (settings.social) {
            this.updateSocialLinks(settings.social);
        }
    }

    updateSocialLinks(social) {
        const socialLinks = {
            instagram: social.instagram,
            youtube: social.youtube,
            facebook: social.facebook,
            twitter: social.twitter
        };

        Object.entries(socialLinks).forEach(([platform, url]) => {
            if (url) {
                const links = document.querySelectorAll(`a[href*="${platform}"]`);
                links.forEach(link => link.href = url);
            }
        });
    }

    applyPageContent(page, data) {
        switch (page) {
            case 'home':
                this.applyHomeContent(data);
                break;
            case 'about':
                this.applyAboutContent(data);
                break;
            case 'contact':
                this.applyContactContent(data);
                break;
            // Add other pages as needed
        }
    }

    applyHomeContent(data) {
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && data.hero_title) {
            heroTitle.innerHTML = data.hero_title;
        }

        const heroTagline = document.querySelector('.hero-tagline');
        if (heroTagline && data.hero_tagline) {
            heroTagline.textContent = data.hero_tagline;
        }

        const heroDescription = document.querySelector('.hero-description');
        if (heroDescription && data.hero_description) {
            heroDescription.textContent = data.hero_description;
        }

        // Update featured work if data is available
        if (data.featured_work) {
            this.updateFeaturedWork(data.featured_work);
        }

        // Update services if data is available
        if (data.services) {
            this.updateServices(data.services);
        }
    }

    renderPortfolioItems() {
        const portfolioGrid = document.getElementById('portfolio-grid');
        if (!portfolioGrid || this.portfolioItems.length === 0) return;

        // Clear existing items (except the first duplicate div)
        const existingItems = portfolioGrid.querySelectorAll('.portfolio-item');
        existingItems.forEach(item => item.remove());

        // Render portfolio items from CMS
        this.portfolioItems.forEach((item, index) => {
            const portfolioElement = this.createPortfolioElement(item, index);
            portfolioGrid.appendChild(portfolioElement);
        });

        // Reinitialize any portfolio-specific JavaScript
        if (window.initPortfolioFilters) {
            window.initPortfolioFilters();
        }
    }

    createPortfolioElement(item, index) {
        const div = document.createElement('div');
        div.className = `portfolio-item`;
        div.setAttribute('data-category', item.category);
        div.setAttribute('data-aos', 'fade-up');
        if (index > 0) div.setAttribute('data-aos-delay', (index * 200).toString());

        div.innerHTML = `
            <div class="portfolio-image">
                <img src="${item.image}" alt="${item.alt}" loading="lazy">
                <div class="portfolio-overlay">
                    <div class="portfolio-info">
                        <h3 class="portfolio-item-title">${item.title}</h3>
                        <p class="portfolio-item-category">${this.formatCategory(item.category)}</p>
                        <a href="#" class="portfolio-link" data-portfolio="${item.slug}">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add click handler for modal
        const link = div.querySelector('.portfolio-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            this.openPortfolioModal(item);
        });

        return div;
    }

    formatCategory(category) {
        const categoryMap = {
            'branding': 'Branding',
            'digital': 'Digital',
            'print': 'Print'
        };
        return categoryMap[category] || category;
    }

    openPortfolioModal(item) {
        // Create and show modal with portfolio item details
        const modal = this.createPortfolioModal(item);
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    createPortfolioModal(item) {
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h2>${item.title}</h2>
                    <span class="modal-category">${this.formatCategory(item.category)}</span>
                </div>
                <div class="modal-body">
                    <div class="modal-image-container">
                        <img src="${item.image}" alt="${item.alt}" class="modal-image" loading="lazy">
                    </div>
                    <div class="modal-details">
                        <div class="modal-description">
                            <p>${item.description}</p>
                        </div>

                        ${item.client ? `<div class="modal-meta">
                            <p><strong>Client:</strong> ${item.client}</p>
                        </div>` : ''}

                        ${item.body ? `<div class="modal-content-body">
                            ${this.markdownToHtml(item.body)}
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Add close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        [closeBtn, overlay].forEach(element => {
            element.addEventListener('click', () => this.closeModal(modal));
        });

        return modal;
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    }

    markdownToHtml(markdown) {
        // Simple markdown to HTML converter
        return markdown
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gim, '<p>$1</p>')
            .replace(/<p><li>/g, '<ul><li>')
            .replace(/<\/li><\/p>/g, '</li></ul>');
    }

    setupLazyLoading() {
        // Implement intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    fallbackToStaticContent() {
        console.log('Falling back to static content');
        // The existing static content will remain as fallback
    }
}

// Initialize CMS content loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CMSContentLoader();
});
