/**
 * DrishyaCity Portfolio - Portfolio Page JavaScript
 * Handles portfolio filtering, animations, and interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioGrid = document.getElementById('portfolio-grid');

    // State Variables
    let currentFilter = 'all';
    let isFiltering = false;

    // Initialize Portfolio
    function init() {
        if (!portfolioGrid) return;
        
        setupFiltering();
        setupPortfolioAnimations();
        setupInfiniteScroll();
        setupImageLazyLoading();
        setupKeyboardNavigation();
    }

    // Portfolio Filtering Setup
    function setupFiltering() {
        filterButtons.forEach(button => {
            button.addEventListener('click', handleFilterClick);
        });
    }

    function handleFilterClick(e) {
        if (isFiltering) return;
        
        const clickedButton = e.target;
        const filter = clickedButton.getAttribute('data-filter');
        
        if (filter === currentFilter) return;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');
        
        // Filter items
        filterPortfolioItems(filter);
        currentFilter = filter;
    }

    function filterPortfolioItems(filter) {
        isFiltering = true;
        
        // Add loading state
        portfolioGrid.style.opacity = '0.7';
        portfolioGrid.style.pointerEvents = 'none';
        
        setTimeout(() => {
            portfolioItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || itemCategory === filter;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    // Animate in with delay
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Remove loading state
            setTimeout(() => {
                portfolioGrid.style.opacity = '1';
                portfolioGrid.style.pointerEvents = 'auto';
                isFiltering = false;
                
                // Trigger layout recalculation for Masonry-like effect
                adjustGridLayout();
            }, 300);
        }, 100);
    }

    // Adjust grid layout (Masonry-like effect)
    function adjustGridLayout() {
        const visibleItems = Array.from(portfolioItems).filter(item => {
            return window.getComputedStyle(item).display !== 'none';
        });
        
        // Reset positions
        visibleItems.forEach(item => {
            item.style.transform = 'translateY(0)';
        });
        
        // Apply staggered animation
        visibleItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 100);
        });
    }

    // Portfolio Animations
    function setupPortfolioAnimations() {
        // Hover animations for portfolio items
        portfolioItems.forEach(item => {
            const image = item.querySelector('.portfolio-image img');
            const overlay = item.querySelector('.portfolio-overlay');
            const info = item.querySelector('.portfolio-info');
            
            item.addEventListener('mouseenter', () => {
                if (image) {
                    image.style.transform = 'scale(1.1)';
                }
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                if (info) {
                    info.style.transform = 'translateY(0)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (image) {
                    image.style.transform = 'scale(1)';
                }
                if (overlay) {
                    overlay.style.opacity = '0';
                }
                if (info) {
                    info.style.transform = 'translateY(20px)';
                }
            });
            
            // Click handler for portfolio items
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.portfolio-link')) {
                    const link = item.querySelector('.portfolio-link');
                    if (link) {
                        window.location.href = link.href;
                    }
                }
            });
        });
        
        // Intersection Observer for scroll animations
        setupScrollAnimations();
    }

    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const delay = Array.from(portfolioItems).indexOf(item) * 100;
                    
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, delay);
                    
                    observer.unobserve(item);
                }
            });
        }, observerOptions);

        portfolioItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Infinite Scroll (Optional Enhancement)
    function setupInfiniteScroll() {
        let loading = false;
        const loadMoreTrigger = document.querySelector('.load-more-trigger');
        
        if (!loadMoreTrigger) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loading) {
                    loadMorePortfolioItems();
                }
            });
        });
        
        observer.observe(loadMoreTrigger);
    }

    function loadMorePortfolioItems() {
        // This would typically load more items from an API
        // For now, we'll simulate loading more items
        console.log('Loading more portfolio items...');
        
        // You could implement AJAX loading here
        // loadPortfolioFromAPI().then(items => {
        //     appendPortfolioItems(items);
        // });
    }

    // Image Lazy Loading for Portfolio
    function setupImageLazyLoading() {
        const images = portfolioGrid.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img).then(() => {
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        });
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    function loadImage(img) {
        return new Promise((resolve, reject) => {
            const newImg = new Image();
            newImg.onload = () => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                resolve();
            };
            newImg.onerror = reject;
            newImg.src = img.dataset.src;
        });
    }

    // Keyboard Navigation
    function setupKeyboardNavigation() {
        // Filter buttons keyboard navigation
        filterButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' && index > 0) {
                    filterButtons[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < filterButtons.length - 1) {
                    filterButtons[index + 1].focus();
                }
            });
        });
        
        // Portfolio items keyboard navigation
        portfolioItems.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = item.querySelector('.portfolio-link');
                    if (link) {
                        link.click();
                    }
                }
                
                // Grid navigation
                const visibleItems = Array.from(portfolioItems).filter(item => {
                    return window.getComputedStyle(item).display !== 'none';
                });
                const currentIndex = visibleItems.indexOf(item);
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = currentIndex + 3; // Assuming 3 columns
                    if (visibleItems[nextIndex]) {
                        visibleItems[nextIndex].focus();
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = currentIndex - 3;
                    if (visibleItems[prevIndex]) {
                        visibleItems[prevIndex].focus();
                    }
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (visibleItems[currentIndex + 1]) {
                        visibleItems[currentIndex + 1].focus();
                    }
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (visibleItems[currentIndex - 1]) {
                        visibleItems[currentIndex - 1].focus();
                    }
                }
            });
        });
    }

    // Portfolio Statistics
    function updatePortfolioStats() {
        const totalItems = portfolioItems.length;
        const visibleItems = Array.from(portfolioItems).filter(item => {
            return window.getComputedStyle(item).display !== 'none';
        }).length;
        
        // Update stats display if element exists
        const statsElement = document.querySelector('.portfolio-stats');
        if (statsElement) {
            statsElement.textContent = `Showing ${visibleItems} of ${totalItems} projects`;
        }
    }

    // Search Functionality (Optional Enhancement)
    function setupPortfolioSearch() {
        const searchInput = document.querySelector('.portfolio-search');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchPortfolio(e.target.value);
            }, 300);
        });
    }

    function searchPortfolio(query) {
        const searchTerm = query.toLowerCase().trim();
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('.portfolio-item-title').textContent.toLowerCase();
            const category = item.querySelector('.portfolio-item-category').textContent.toLowerCase();
            const matches = title.includes(searchTerm) || category.includes(searchTerm);
            
            if (searchTerm === '' || matches) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        updatePortfolioStats();
    }

    // Portfolio Item Builder (for dynamic content)
    function createPortfolioItem(data) {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.setAttribute('data-category', data.category);
        
        item.innerHTML = `
            <div class="portfolio-image">
                <img src="${data.image}" alt="${data.title}" loading="lazy">
                <div class="portfolio-overlay">
                    <div class="portfolio-info">
                        <h3 class="portfolio-item-title">${data.title}</h3>
                        <p class="portfolio-item-category">${data.categoryName}</p>
                        <a href="project-detail.html?project=${data.id}" class="portfolio-link">
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }

    // URL State Management
    function setupURLStateManagement() {
        // Update URL when filter changes
        const originalHandleFilterClick = handleFilterClick;
        handleFilterClick = function(e) {
            originalHandleFilterClick.call(this, e);
            
            const filter = e.target.getAttribute('data-filter');
            const url = new URL(window.location);
            
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            
            window.history.replaceState({}, '', url);
        };
        
        // Apply filter from URL on page load
        const urlParams = new URLSearchParams(window.location.search);
        const filterFromURL = urlParams.get('filter');
        
        if (filterFromURL && filterFromURL !== 'all') {
            const filterButton = document.querySelector(`[data-filter="${filterFromURL}"]`);
            if (filterButton) {
                filterButton.click();
            }
        }
    }

    // Performance Optimization
    function optimizePerformance() {
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                adjustGridLayout();
            }, 250);
        });
        
        // Throttle scroll events
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    // Scroll-based animations can be added here
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        });
    }

    // Analytics Integration (Optional)
    function trackPortfolioInteractions() {
        // Track filter usage
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                // Analytics code would go here
                console.log('Portfolio filter used:', filter);
            });
        });
        
        // Track portfolio item clicks
        portfolioItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const title = item.querySelector('.portfolio-item-title').textContent;
                // Analytics code would go here
                console.log('Portfolio item clicked:', title);
            });
        });
    }

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Additional setup after page load
    window.addEventListener('load', () => {
        setupPortfolioSearch();
        setupURLStateManagement();
        optimizePerformance();
        trackPortfolioInteractions();
        updatePortfolioStats();
    });

    // Export functions for external use
    window.DrishyaCityPortfolio = {
        filterPortfolioItems,
        createPortfolioItem,
        searchPortfolio,
        updatePortfolioStats
    };

})();

// Add CSS for portfolio animations
const portfolioStyles = document.createElement('style');
portfolioStyles.textContent = `
    .portfolio-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .portfolio-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .portfolio-item:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 4px;
    }
    
    .portfolio-overlay {
        transition: opacity 0.3s ease;
    }
    
    .portfolio-info {
        transform: translateY(20px);
        transition: transform 0.3s ease 0.1s;
    }
    
    .portfolio-search {
        width: 100%;
        max-width: 400px;
        padding: 0.75rem 1rem;
        border: 2px solid var(--gray-300);
        border-radius: var(--radius);
        font-size: 1rem;
        margin-bottom: 2rem;
    }
    
    .portfolio-search:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .portfolio-stats {
        text-align: center;
        color: var(--text-secondary);
        margin-top: 2rem;
        font-style: italic;
    }
    
    .load-more-trigger {
        height: 20px;
        margin-top: 2rem;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .portfolio-item {
            transition: none;
        }
        
        .portfolio-image img {
            transition: none;
        }
        
        .portfolio-overlay,
        .portfolio-info {
            transition: none;
        }
    }
`;
document.head.appendChild(portfolioStyles);
