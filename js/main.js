/**
 * KC Monter - Main JavaScript
 * Kjøkkenmontering med Presisjon
 */

(function() {
    'use strict';

    // ========================================
    // Mobile Navigation
    // ========================================
    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav__toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (!navToggle || !mobileNav) return;

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav__link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') &&
                !mobileNav.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                navToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    };

    // ========================================
    // Header Scroll Effect
    // ========================================
    const initHeaderScroll = () => {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    };

    // ========================================
    // Active Navigation Link
    // ========================================
    const initActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage ||
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    };

    // ========================================
    // Contact Form Handling
    // ========================================
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const formMessage = document.getElementById('form-message');

        // Validation rules
        const validators = {
            name: (value) => {
                if (!value.trim()) return 'Vennligst oppgi navn';
                if (value.trim().length < 2) return 'Navnet må være minst 2 tegn';
                return null;
            },
            email: (value) => {
                if (!value.trim()) return 'Vennligst oppgi e-postadresse';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Vennligst oppgi en gyldig e-postadresse';
                }
                return null;
            },
            phone: (value) => {
                if (!value.trim()) return 'Vennligst oppgi telefonnummer';
                const cleanPhone = value.replace(/[\s\-\+]/g, '');
                if (cleanPhone.length < 8) {
                    return 'Vennligst oppgi et gyldig telefonnummer';
                }
                return null;
            },
            description: (value) => {
                if (!value.trim()) return 'Vennligst beskriv prosjektet';
                if (value.trim().length < 20) {
                    return 'Beskrivelsen må være minst 20 tegn';
                }
                return null;
            }
        };

        // Validate single field
        const validateField = (field) => {
            const validator = validators[field.name];
            if (!validator) return true;

            const error = validator(field.value);
            const formGroup = field.closest('.form-group');
            let errorEl = formGroup.querySelector('.form-error');

            if (error) {
                formGroup.classList.add('error');
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.className = 'form-error';
                    formGroup.appendChild(errorEl);
                }
                errorEl.textContent = error;
                errorEl.style.display = 'block';
                return false;
            } else {
                formGroup.classList.remove('error');
                if (errorEl) {
                    errorEl.style.display = 'none';
                }
                return true;
            }
        };

        // Add real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                const formGroup = field.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all required fields
            let isValid = true;
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstError = form.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Disable submit button and show loading
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sender...';

            // Collect form data
            const formData = {
                name: form.querySelector('[name="name"]').value.trim(),
                email: form.querySelector('[name="email"]').value.trim(),
                phone: form.querySelector('[name="phone"]').value.trim(),
                location: form.querySelector('[name="location"]')?.value.trim() || '',
                projectType: form.querySelector('[name="projectType"]')?.value || '',
                kitchenBrand: form.querySelector('[name="kitchenBrand"]')?.value || '',
                description: form.querySelector('[name="description"]').value.trim(),
                wantSiteVisit: form.querySelector('[name="siteVisit"]')?.checked || false
            };

            try {
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Log form data for development
                console.log('Form submitted:', formData);

                // Show success message
                if (formMessage) {
                    formMessage.className = 'form-message success';
                    formMessage.innerHTML = `
                        <strong>Takk for din henvendelse!</strong><br>
                        Jeg har mottatt meldingen din og tar kontakt så snart som mulig,
                        vanligvis innen én arbeidsdag.
                    `;
                    formMessage.style.display = 'block';
                }

                // Reset form
                form.reset();

                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);

                if (formMessage) {
                    formMessage.className = 'form-message error';
                    formMessage.innerHTML = `
                        <strong>Beklager, noe gikk galt.</strong><br>
                        Vennligst prøv igjen eller ring meg direkte.
                    `;
                    formMessage.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    };

    // ========================================
    // Scroll to Top Button
    // ========================================
    const initScrollToTop = () => {
        const scrollBtn = document.querySelector('.scroll-top');
        if (!scrollBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, { passive: true });

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // ========================================
    // Smooth Scrolling for Anchor Links
    // ========================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#0') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ========================================
    // Lazy Loading Images
    // ========================================
    const initLazyLoading = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (!lazyImages.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };

    // ========================================
    // Phone Click Tracking
    // ========================================
    const initPhoneTracking = () => {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Track phone clicks if analytics is available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click_to_call', {
                        event_category: 'Contact',
                        event_label: 'Phone Click'
                    });
                }
            });
        });
    };

    // ========================================
    // Email Click Tracking
    // ========================================
    const initEmailTracking = () => {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

        emailLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click_to_email', {
                        event_category: 'Contact',
                        event_label: 'Email Click'
                    });
                }
            });
        });
    };

    // ========================================
    // Service Cards Animation
    // ========================================
    const initServiceCardAnimation = () => {
        const cards = document.querySelectorAll('.service-card');
        if (!cards.length) return;

        if ('IntersectionObserver' in window) {
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }, {
                threshold: 0.1
            });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                cardObserver.observe(card);
            });
        }
    };

    // ========================================
    // Initialize All Functions
    // ========================================
    const init = () => {
        initMobileNav();
        initHeaderScroll();
        initActiveNavLink();
        initContactForm();
        initScrollToTop();
        initSmoothScroll();
        initLazyLoading();
        initPhoneTracking();
        initEmailTracking();
        initServiceCardAnimation();
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
