// ===========================
// Mobile Menu Toggle - Enhanced
// ===========================

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const header = document.querySelector('.header');

// Toggle mobile menu with smooth animation
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('active')) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-link, .btn-login, .btn-signup');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===========================
// Smooth Scrolling - Enhanced
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#login' && href !== '#signup') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===========================
// Header Scroll Effect
// ===========================

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for styling changes
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===========================
// Active Nav Link on Scroll
// ===========================

const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===========================
// Enhanced Scroll Animations with Intersection Observer
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Unobserve after animation to improve performance
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with stagger effect
const animatedElements = document.querySelectorAll(
    '.product-card, .testimonial-card, .benefit-card'
);

animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    fadeInObserver.observe(el);
});

// ===========================
// Product Carousel - Enhanced
// ===========================

class ProductCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.indicators = Array.from(container.querySelectorAll('.indicator'));

        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        // Button navigation
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        // Indicator navigation
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch/Swipe support
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', () => this.handleTouchEnd());

        // Mouse drag support (optional)
        let isDragging = false;
        let startX = 0;

        this.track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            this.track.style.cursor = 'grabbing';
        });

        this.track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const diff = e.clientX - startX;
            if (Math.abs(diff) > 50) {
                isDragging = false;
                this.track.style.cursor = 'grab';
                if (diff > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            }
        });

        this.track.addEventListener('mouseup', () => {
            isDragging = false;
            this.track.style.cursor = 'grab';
        });

        this.track.addEventListener('mouseleave', () => {
            isDragging = false;
            this.track.style.cursor = 'grab';
        });

        // Auto-play
        this.startAutoPlay();

        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // Initial update
        this.updateCarousel(false);
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchMove(e) {
        this.touchEndX = e.touches[0].clientX;
    }

    handleTouchEnd() {
        const diff = this.touchStartX - this.touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                // Swipe left - next
                this.next();
            } else {
                // Swipe right - prev
                this.prev();
            }
        }

        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    prev() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    next() {
        if (this.isAnimating) return;
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel(animate = true) {
        if (animate) {
            this.isAnimating = true;
        }

        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
            indicator.setAttribute('aria-selected', index === this.currentIndex);
        });

        // Transform track
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        if (animate) {
            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), 5000); // Change slide every 5 seconds
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    // Only initialize carousel if the container has a carousel-track (dynamic carousel)
    // This prevents initialization for static grid layouts
    if (carouselContainer && carouselContainer.querySelector('.carousel-track')) {
        new ProductCarousel(carouselContainer);
    }
});

// ===========================
// Button Ripple Effect
// ===========================

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');

    const rippleElement = button.getElementsByClassName('ripple')[0];
    if (rippleElement) {
        rippleElement.remove();
    }

    button.appendChild(ripple);
}


// ===========================
// Lazy Loading Images
// ===========================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===========================
// Performance Optimization - Debounce
// ===========================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedHighlight = debounce(highlightNavigation, 10);
window.addEventListener('scroll', debouncedHighlight);

// ===========================
// Initialize on Page Load
// ===========================

window.addEventListener('load', () => {
    // Trigger initial scroll check
    highlightNavigation();

    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');

    // Preload critical images
    const criticalImages = document.querySelectorAll('.hero-circle img, .product-image');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
});

// ===========================
// Page Visibility API - Pause animations when tab is hidden
// ===========================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations
        document.body.style.animationPlayState = 'running';
    }
});


/* ============================================
   FOOTER
   ============================================ */

const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");

city.addEventListener("toggle", toggleCont);

city.addEventListener("click", () => {
    city.dispatchEvent(new Event("toggle"));
});

function toggleCont() {
    city.classList.toggle("active");
    cont.forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}

