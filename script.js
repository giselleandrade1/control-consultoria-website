// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#main-menu');
const header = document.querySelector('.site-header');
const backToTop = document.getElementById('back-to-top');
const leadForm = document.querySelector('#lead-form');
const revealElements = document.querySelectorAll('.reveal');
const counterElements = document.querySelectorAll('[data-target]');

const WHATSAPP_NUMBER = '5511961371183';
const THEME_STORAGE_KEY = 'theme';
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const mobileQuery = window.matchMedia('(max-width: 768px)');

// Get stored theme
const getStoredTheme = () => {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
        return null;
    }
};

// Get system theme
const getSystemTheme = () => (themeQuery.matches ? 'dark' : 'light');

// Apply theme
const applyTheme = (theme, persist = true) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', theme === 'dark' ? '#061126' : '#FFFFFF');
    }
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    if (persist) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch { }
    }
};

// Initialize theme
const initTheme = () => {
    const stored = getStoredTheme();
    const initialTheme = stored || getSystemTheme();
    applyTheme(initialTheme, !stored);

    if (!stored) {
        themeQuery.addEventListener('change', (e) => {
            applyTheme(e.matches ? 'dark' : 'light', false);
        });
    }
};

// Theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(8);
        }
    });
}

// Menu toggle
const toggleMenu = () => {
    if (!menuToggle || !mainMenu) return;

    const isOpen = menuToggle.classList.toggle('is-open');
    mainMenu.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
};

const closeMenu = () => {
    if (!menuToggle || !mainMenu) return;
    menuToggle.classList.remove('is-open');
    mainMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
};

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// Close menu on link click
if (mainMenu) {
    mainMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}

// Close menu on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

// Close menu on viewport change
mobileQuery.addEventListener('change', (e) => {
    if (!e.matches) closeMenu();
});

// Header scroll effect
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// Back to top button
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Intersection Observer for reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach((el) => observer.observe(el));

// Counter animation
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counterElements.forEach((el) => counterObserver.observe(el));

// Form submission
if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(leadForm);
        const name = String(formData.get('name') || '').trim();
        const company = String(formData.get('company') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const service = String(formData.get('service') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !email || !phone || !service || !message) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

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
        ]
            .filter(Boolean)
            .join('\n');

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener,noreferrer');

        // Reset form
        leadForm.reset();

        // Show confirmation
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviado com sucesso! ✓';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    });
}

// FAQ Accordion
const faqDetails = document.querySelectorAll('.faq-accordion details');
if (faqDetails.length > 0) {
    faqDetails.forEach((detail) => {
        detail.addEventListener('click', (e) => {
            // Close other details when one is opened
            if (detail.open) {
                faqDetails.forEach((other) => {
                    if (other !== detail && other.open) {
                        other.open = false;
                    }
                });
            }
        });
    });
}

// Initialize
initTheme();

// Prefetch links for better performance
const prefetchLinks = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.style.willChange = 'transform';
            }
        });
        link.addEventListener('mouseleave', () => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.style.willChange = 'auto';
            }
        });
    });
};

prefetchLinks();

// Log that script loaded successfully
console.log('✓ Control Consultoria - Script loaded successfully');
