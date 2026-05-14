// =========================
// DOM REFERENCES
// =========================
(() => {
    'use strict';

    const WHATSAPP_NUMBER = '5511961371183';
    const THEME_STORAGE_KEY = 'theme';

    const refs = {
        themeToggle: null,
        themeColorMeta: document.querySelector('meta[name="theme-color"]'),
        header: document.querySelector('.site-header'),
        backToTop: document.getElementById('back-to-top'),
        leadForm: null,
        revealElements: null,
        counterElements: null,
        mobileMenu: document.getElementById('mobile-menu'),
        mobileMenuToggle: null,
        mobileMenuClose: null,
        mobileMenuLinks: null
    };

    // =========================
    // THEME SYSTEM
    // =========================
    const getStoredTheme = () => { try { return localStorage.getItem(THEME_STORAGE_KEY); } catch { return null; } };
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const getSystemTheme = () => (themeQuery.matches ? 'dark' : 'light');

    const applyTheme = (theme, persist = true) => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        if (refs.themeColorMeta) refs.themeColorMeta.setAttribute('content', theme === 'dark' ? '#061126' : '#FFFFFF');
        if (refs.themeToggle) refs.themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
        if (refs.themeToggle) refs.themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
        if (persist) { try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { } }
    };

    const initTheme = () => {
        const stored = getStoredTheme();
        const initial = stored || getSystemTheme();
        applyTheme(initial, !stored);
        if (!stored) {
            themeQuery.addEventListener('change', (e) => applyTheme(e.matches ? 'dark' : 'light', false));
        }
    };

    // =========================
    // MOBILE MENU (accessible)
    // =========================
    let mobileMenuOpen = false;
    let _lastFocusedElement = null;

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const trapFocus = (container) => {
        const focusable = Array.from(container.querySelectorAll(focusableSelector));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const onKey = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        };
        container._trapHandler = onKey;
        document.addEventListener('keydown', onKey);
    };

    const releaseFocus = (container) => {
        if (container && container._trapHandler) {
            document.removeEventListener('keydown', container._trapHandler);
            delete container._trapHandler;
        }
    };

    const openMobileMenu = () => {
        if (!refs.mobileMenu || mobileMenuOpen) return;
        _lastFocusedElement = document.activeElement;
        mobileMenuOpen = true;
        refs.mobileMenu.classList.add('is-open');
        refs.mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        if (navigator.vibrate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate(12);
        if (refs.mobileMenuToggle) {
            refs.mobileMenuToggle.setAttribute('aria-expanded', 'true');
            refs.mobileMenuToggle.setAttribute('aria-label', 'Fechar menu');
        }
        const first = refs.mobileMenu.querySelector(focusableSelector);
        if (first) first.focus();
        trapFocus(refs.mobileMenu);
    };

    const closeMobileMenu = () => {
        if (!refs.mobileMenu || !mobileMenuOpen) return;
        mobileMenuOpen = false;
        refs.mobileMenu.classList.remove('is-open');
        refs.mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        if (navigator.vibrate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate(8);
        if (refs.mobileMenuToggle) {
            refs.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            refs.mobileMenuToggle.setAttribute('aria-label', 'Abrir menu');
        }
        releaseFocus(refs.mobileMenu);
        if (_lastFocusedElement && typeof _lastFocusedElement.focus === 'function') _lastFocusedElement.focus();
    };

    const toggleMobileMenu = () => mobileMenuOpen ? closeMobileMenu() : openMobileMenu();

    // =========================
    // HEADER EFFECTS
    // =========================
    const onScrollHeader = () => {
        if (!refs.header) return;
        refs.header.classList.toggle('scrolled', window.scrollY > 12);
        if (refs.backToTop) refs.backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    };

    // =========================
    // SCROLL ANIMATIONS
    // =========================
    let revealObserver = null;
    let counterObserver = null;

    const initObservers = () => {
        refs.revealElements = document.querySelectorAll('.reveal');
        refs.counterElements = document.querySelectorAll('[data-target]');

        // Respect user's motion preference
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            refs.revealElements.forEach(el => el.classList.add('is-visible'));
        } else {
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
                });
            }, observerOptions);
            refs.revealElements.forEach(el => revealObserver.observe(el));
        }

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'), 10) || 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { element.textContent = target + '+'; clearInterval(timer); }
                else element.textContent = Math.floor(current);
            }, 16);
        };

        counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.5 });

        refs.counterElements.forEach(el => counterObserver.observe(el));
    };

    const initActiveNavState = () => {
        const navLinks = Array.from(document.querySelectorAll('.desktop-nav-link, .mobile-menu-link'));
        const targets = navLinks
            .map((link) => {
                const href = link.getAttribute('href') || '';
                return href.startsWith('#') ? document.querySelector(href) : null;
            })
            .filter(Boolean);

        if (!targets.length) return;

        const setActive = (id) => {
            navLinks.forEach((link) => {
                const active = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });
        };

        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible && visible.target.id) setActive(visible.target.id);
        }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] });

        targets.forEach((target) => observer.observe(target));
    };

    // =========================
    // INTERACTIONS
    // =========================
    const initForm = () => {
        refs.leadForm = document.querySelector('#lead-form');
        if (!refs.leadForm) return;

        const phoneInput = refs.leadForm.querySelector('#form-phone');
        const formatPhone = (value) => {
            const digits = String(value || '').replace(/\D/g, '').slice(0, 11);
            if (digits.length <= 2) return digits ? `(${digits}` : '';
            if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        };

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                const formatted = formatPhone(phoneInput.value);
                phoneInput.value = formatted;
            });
        }

        refs.leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(refs.leadForm);
            const name = String(formData.get('name') || '').trim();
            const company = String(formData.get('company') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const service = String(formData.get('service') || '').trim();
            const message = String(formData.get('message') || '').trim();
            if (!name || !email || !phone || !service || !message) { alert('Por favor, preencha todos os campos obrigatórios.'); return; }
            const text = [
                'Olá, gostaria de solicitar uma proposta de consultoria empresarial.',
                `Nome: ${name}`,
                company ? `Empresa: ${company}` : null,
                `E-mail: ${email}`,
                `WhatsApp: ${phone}`,
                `Serviço de interesse: ${service}`,
                `Mensagem: ${message}`,
                '\n---',
                'Enviado via Control Consultoria'
            ].filter(Boolean).join('\n');

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            refs.leadForm.reset();
            const submitBtn = refs.leadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const original = submitBtn.textContent; submitBtn.textContent = 'Enviado com sucesso! ✓'; submitBtn.disabled = true;
                setTimeout(() => { submitBtn.textContent = original; submitBtn.disabled = false; }, 3000);
            }
        });
    };

    // =========================
    // ACCESSIBILITY
    // =========================
    const initFAQ = () => {
        const faqDetails = document.querySelectorAll('.faq-accordion details');
        if (!faqDetails.length) return;
        faqDetails.forEach(detail => detail.addEventListener('click', () => {
            if (detail.open) {
                faqDetails.forEach(other => { if (other !== detail && other.open) other.open = false; });
            }
        }));
    };

    const prefetchLinks = () => {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                if (target) target.style.willChange = 'transform';
            });
            link.addEventListener('mouseleave', () => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                if (target) target.style.willChange = 'auto';
            });
        });
    };

    // =========================
    // INITIALIZATION
    // =========================
    const init = () => {
        refs.themeToggle = document.querySelector('.theme-toggle');
        refs.backToTop = document.getElementById('back-to-top');
        refs.revealElements = document.querySelectorAll('.reveal');
        refs.counterElements = document.querySelectorAll('[data-target]');
        refs.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        refs.mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

        // Theme init and toggle
        initTheme();
        if (refs.themeToggle) {
            refs.themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next, true);
                if (navigator.vibrate) navigator.vibrate(8);
            });
        }

        // desktop compact menu removed — we use dedicated desktop nav and fullscreen mobile menu

        // Mobile menu
        if (refs.mobileMenuToggle) refs.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        if (refs.mobileMenuLinks && refs.mobileMenuLinks.length) refs.mobileMenuLinks.forEach(l => l.addEventListener('click', closeMobileMenu));
        if (refs.mobileMenu) {
            refs.mobileMenu.addEventListener('click', (event) => {
                if (event.target === refs.mobileMenu) closeMobileMenu();
            });
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeMobileMenu(); } });

        // Responsive changes: close menu when viewport expands
        const mobileQuery = window.matchMedia('(max-width: 768px)');
        const desktopQuery = window.matchMedia('(min-width: 769px)');
        const closeOnDesktop = (e) => { if (e.matches) closeMobileMenu(); };
        mobileQuery.addEventListener('change', (e) => { if (!e.matches) closeMobileMenu(); });
        desktopQuery.addEventListener('change', closeOnDesktop);

        if (desktopQuery.matches) closeMobileMenu();

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 769) closeMobileMenu();
        }, { passive: true });

        // Header scroll
        window.addEventListener('scroll', onScrollHeader, { passive: true });

        // Back to top click
        if (refs.backToTop) refs.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // Observers, form, FAQ, prefetch
        initObservers();
        initActiveNavState();
        initForm();
        initFAQ();
        prefetchLinks();

        console.log('✓ Control Consultoria - main.js initialized');
    };

    // If script is deferred, document is ready; otherwise wait DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
