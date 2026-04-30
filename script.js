const header = document.querySelector('.site-header');
const themeToggle = document.querySelector('.theme-toggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const revealElements = document.querySelectorAll('.reveal');
const leadForm = document.querySelector('#lead-form');
const whatsappNumber = '5511961371183';
const themeStorageKey = 'theme';
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const readStoredTheme = () => {
    try {
        const value = localStorage.getItem(themeStorageKey);
        return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
        return null;
    }
};

const getSystemTheme = () => (themeQuery.matches ? 'dark' : 'light');

const setThemeMetaColor = (theme) => {
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', theme === 'dark' ? '#061126' : '#FFFFFF');
    }
};

const applyTheme = (theme, persist = true) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
    setThemeMetaColor(theme);

    if (persist) {
        try {
            localStorage.setItem(themeStorageKey, theme);
        } catch (error) {
            /* Storage can be unavailable in private contexts. */
        }
    }
};

let userHasThemePreference = false;
const savedTheme = readStoredTheme();
const initialTheme = savedTheme || getSystemTheme();

if (savedTheme) {
    userHasThemePreference = true;
}

applyTheme(initialTheme, false);

if (!userHasThemePreference) {
    const syncSystemTheme = (event) => {
        if (!userHasThemePreference) {
            applyTheme(event.matches ? 'dark' : 'light', false);
        }
    };

    if (typeof themeQuery.addEventListener === 'function') {
        themeQuery.addEventListener('change', syncSystemTheme);
    } else if (typeof themeQuery.addListener === 'function') {
        themeQuery.addListener(syncSystemTheme);
    }
}

themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getSystemTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    userHasThemePreference = true;
    applyTheme(nextTheme, true);

    // Trigger animation
    themeToggle.classList.remove('is-animating');
    void themeToggle.offsetWidth; // Trigger reflow
    themeToggle.classList.add('is-animating');

    window.setTimeout(() => {
        themeToggle.classList.remove('is-animating');
    }, 600);

    // Haptic feedback (if available)
    if (navigator.vibrate) {
        navigator.vibrate(8);
    }
});

const observer = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.12 }
);

revealElements.forEach((element) => observer.observe(element));

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
});

leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const name = String(formData.get('name') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const service = String(formData.get('service') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const text = [
        'Olá, gostaria de solicitar uma proposta pela Control Consultoria Empresarial.',
        `Nome: ${name}`,
        company ? `Empresa: ${company}` : null,
        `E-mail: ${email}`,
        `WhatsApp: ${phone}`,
        `Serviço de interesse: ${service}`,
        `Mensagem: ${message}`,
    ]
        .filter(Boolean)
        .join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    leadForm.reset();
});
