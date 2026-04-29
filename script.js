const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const revealElements = document.querySelectorAll('.reveal');
const leadForm = document.querySelector('#lead-form');
const whatsappNumber = '5511961371183';

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

menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open');
});

siteNav?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

leadForm?.addEventListener('submit', (event) => {
    event.preventDefault();

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
