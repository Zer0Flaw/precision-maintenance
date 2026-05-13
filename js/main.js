// DOM Elements
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navMenu      = document.getElementById('nav-menu');
const contactForm  = document.getElementById('contactForm');
const quoteForm    = document.getElementById('quoteForm');
const scrollTopBtn = document.getElementById('scrollTop');
const emergencyCta = document.getElementById('emergencyCta');

// Carousel Elements
const carousel   = document.querySelector('.carousel');
const slides     = document.querySelectorAll('.carousel-slide');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');

// Elements to animate on scroll
const fadeElements = document.querySelectorAll(
    '.service-card, .review-card, .contact-item, .trust-point, .trust-badge'
);

// State
let currentSlide = 0;
let autoSlideInterval;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initCarousel();
    initScrollAnimations();
    initContactForm();
    initQuoteForm();
    initScrollTopButton();
    initEmergencyCta();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Scrolled state for navbar shadow
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    });

    // Smooth scroll for all anchor links, offset by navbar height
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    });
}

// ============================================
// Carousel
// ============================================
function initCarousel() {
    if (!carousel || slides.length === 0) return;

    startAutoSlide();

    prevBtn.addEventListener('click', function () {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', function () {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
    });

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Touch/swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            stopAutoSlide();
            diff > 0 ? nextSlide() : prevSlide();
            startAutoSlide();
        }
    });
}

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    indicators.forEach(i => i.classList.remove('active'));
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
function prevSlide()  { showSlide((currentSlide - 1 + slides.length) % slides.length); }
function goToSlide(i) { showSlide(i); }

function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 5000); }
function stopAutoSlide()  { clearInterval(autoSlideInterval); }

// Keyboard navigation for carousel
document.addEventListener('keydown', function (e) {
    if (!carousel) return;
    if (e.key === 'ArrowLeft')  { stopAutoSlide(); prevSlide(); startAutoSlide(); }
    if (e.key === 'ArrowRight') { stopAutoSlide(); nextSlide(); startAutoSlide(); }
});

// ============================================
// Scroll Animations (fade-in on viewport entry)
// ============================================
function initScrollAnimations() {
    fadeElements.forEach(el => el.classList.add('fade-in'));
    window.addEventListener('scroll', debounce(checkFadeElements, 80));
    checkFadeElements();
}

function checkFadeElements() {
    const windowH = window.innerHeight;
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowH * 0.88 && rect.bottom > 0) {
            el.classList.add('visible');
        }
    });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(contactForm));

        if (!data.name || !data.email || !data.phone || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }
        if (!isValidEmail(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!isValidPhone(data.phone)) {
            alert('Please enter a valid phone number.');
            return;
        }

        alert("Message sent! We'll be in touch soon.");
        contactForm.reset();
        // TODO: Connect form to email service (EmailJS, Formspree, or backend endpoint)
        console.log('Contact form data:', data);
    });
}

// ============================================
// Quote Form
// ============================================
function initQuoteForm() {
    if (!quoteForm) return;

    quoteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(quoteForm));

        if (!data.name || !data.email || !data.phone || !data.service || !data.urgency) {
            alert('Please fill in all required fields: Name, Phone, Email, Service, and Urgency.');
            return;
        }
        if (!isValidEmail(data.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!isValidPhone(data.phone)) {
            alert('Please enter a valid phone number.');
            return;
        }

        alert("Quote request sent to quotes@precisionmaintenancecf.com! We'll get back to you within 24 hours.");
        quoteForm.reset();
        // TODO: Connect to EmailJS/Formspree sending to quotes@precisionmaintenancecf.com
        console.log('Quote form data:', data);
    });
}

// ============================================
// Scroll-to-Top Button
// ============================================
function initScrollTopButton() {
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', debounce(function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, 80));

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// Floating Emergency CTA (mobile)
// Appears after the user scrolls past the hero section
// ============================================
function initEmergencyCta() {
    if (!emergencyCta) return;
    const hero = document.getElementById('home');

    window.addEventListener('scroll', debounce(function () {
        if (!hero) return;
        const heroBelowFold = hero.getBoundingClientRect().bottom < 80;
        emergencyCta.classList.toggle('visible', heroBelowFold);
        emergencyCta.setAttribute('aria-hidden', heroBelowFold ? 'false' : 'true');
    }, 80));
}

// ============================================
// Validation Helpers
// ============================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
}

// ============================================
// Utility
// ============================================
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ============================================
// Analytics placeholder (wired to all .btn clicks)
// ============================================
function trackEvent(eventName, properties) {
    // TODO: Add analytics tracking (Google Analytics, etc.)
    console.log('Track event:', eventName, properties);
}

document.querySelectorAll('.btn, .btn-quote-submit').forEach(button => {
    button.addEventListener('click', function () {
        trackEvent('button_click', {
            button_text: this.textContent.trim(),
            button_type: this.className
        });
    });
});

// ============================================
// Performance monitoring
// ============================================
if ('performance' in window) {
    window.addEventListener('load', function () {
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav) console.log('Page load:', Math.round(nav.loadEventEnd - nav.startTime), 'ms');
    });
}

if ('serviceWorker' in navigator) {
    // TODO: Add service worker for offline capabilities
    console.log('Service Worker support detected');
}
