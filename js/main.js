(() => {
    "use strict";

    const root = document.documentElement;
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const themeIcon = document.querySelector("[data-theme-icon]");

    const icons = {
        moon: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
        sun: `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.9"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
      </svg>
    `
    };

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const header = document.querySelector(".site-header");
    const mobileMenu = document.querySelector("[data-mobile-menu]");
    const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
    const mobileMenuClose = document.querySelector("[data-mobile-menu-close]");
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll("a[href^='#']") : [];
    const navLinks = document.querySelectorAll(".desktop-nav a[href^='#'], .mobile-menu-nav a[href^='#']");
    const revealElements = document.querySelectorAll(".reveal");
    const countElements = document.querySelectorAll("[data-count]");
    const contactForm = document.querySelector("[data-contact-form]");
    const feedback = document.querySelector("[data-form-feedback]");

    const THEME_KEY = "control-theme";
    const WHATSAPP_NUMBER = "5511961371183";
    const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const desktopQuery = window.matchMedia("(min-width: 769px)");

    let menuOpen = false;
    let previousFocus = null;
    let hasSavedTheme = false;

    const getStoredTheme = () => {
        try {
            const value = localStorage.getItem(THEME_KEY);
            return value === "light" || value === "dark" ? value : null;
        } catch {
            return null;
        }
    };

    const getPreferredTheme = () => {
        const savedTheme = getStoredTheme();
        if (savedTheme) {
            hasSavedTheme = true;
            return savedTheme;
        }

        return prefersDarkQuery.matches ? "dark" : "light";
    };

    const applyTheme = (theme, persist = false) => {
        root.setAttribute("data-theme", theme);
        root.style.colorScheme = theme;

        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", theme === "dark" ? "#061126" : "#FFFFFF");
        }

        if (themeIcon) {
            themeIcon.innerHTML = theme === "dark" ? icons.sun : icons.moon;
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
            );
        }

        if (persist) {
            try {
                localStorage.setItem(THEME_KEY, theme);
                hasSavedTheme = true;
            } catch {
                // localStorage unavailable in some private contexts.
            }
        }
    };

    const initTheme = () => {
        applyTheme(getPreferredTheme());

        if (!hasSavedTheme) {
            prefersDarkQuery.addEventListener("change", (event) => {
                applyTheme(event.matches ? "dark" : "light");
            });
        }
    };

    const setHeaderState = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", active);
            if (active) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const initSectionObserver = () => {
        const sections = [...document.querySelectorAll("main section[id]")];
        if (!sections.length) return;

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    const visible = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                    if (visible && visible.target.id) {
                        setActiveLink(visible.target.id);
                    }
                },
                {
                    threshold: [0.15, 0.3, 0.55],
                    rootMargin: "-20% 0px -55% 0px"
                }
            );

            sections.forEach((section) => observer.observe(section));
        }
    };

    const animateCount = (element) => {
        const target = Number(element.dataset.count || 0);
        const suffix = element.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();

        const tick = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            element.textContent = `${value}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(tick);
            }
        };

        window.requestAnimationFrame(tick);
    };

    const initRevealAnimations = () => {
        if (!revealElements.length) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach((element) => element.classList.add("is-visible"));
            countElements.forEach((element) => animateCount(element));
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
        );

        revealElements.forEach((element) => revealObserver.observe(element));

        if (countElements.length) {
            const counterObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateCount(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.4 }
            );

            countElements.forEach((element) => counterObserver.observe(element));
        }
    };

    const getFocusableElements = () => {
        if (!mobileMenu) return [];

        return [...mobileMenu.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")];
    };

    const openMenu = () => {
        if (!mobileMenu || menuOpen) return;

        previousFocus = document.activeElement;
        menuOpen = true;
        mobileMenu.classList.add("is-open");
        mobileMenu.setAttribute("aria-hidden", "false");
        document.body.classList.add("menu-open");

        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute("aria-expanded", "true");
            mobileMenuToggle.setAttribute("aria-label", "Fechar menu");
        }

        const firstFocusable = getFocusableElements()[0];
        if (firstFocusable) {
            firstFocusable.focus();
        }
    };

    const closeMenu = () => {
        if (!mobileMenu || !menuOpen) return;

        menuOpen = false;
        mobileMenu.classList.remove("is-open");
        mobileMenu.setAttribute("aria-hidden", "true");
        document.body.classList.remove("menu-open");

        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute("aria-expanded", "false");
            mobileMenuToggle.setAttribute("aria-label", "Abrir menu");
        }

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    };

    const initMobileMenu = () => {
        if (!mobileMenu || !mobileMenuToggle) return;

        mobileMenuToggle.addEventListener("click", () => {
            menuOpen ? closeMenu() : openMenu();
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener("click", closeMenu);
        }

        mobileMenu.addEventListener("click", (event) => {
            if (event.target === mobileMenu) {
                closeMenu();
            }

            if (event.target instanceof Element && event.target.closest("[data-mobile-menu-close]")) {
                closeMenu();
            }
        });

        mobileMenuLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }

            if (!menuOpen || event.key !== "Tab") {
                return;
            }

            const focusables = getFocusableElements();
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        desktopQuery.addEventListener("change", (event) => {
            if (event.matches) {
                closeMenu();
            }
        });
    };

    const initContactForm = () => {
        if (!contactForm) return;

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = String(formData.get("name") || "").trim();
            const company = String(formData.get("company") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const phone = String(formData.get("phone") || "").trim();
            const service = String(formData.get("service") || "").trim();
            const message = String(formData.get("message") || "").trim();

            const text = [
                "Olá, gostaria de solicitar uma proposta para a Control Consultoria Empresarial.",
                `Nome: ${name}`,
                company ? `Empresa: ${company}` : null,
                `E-mail: ${email}`,
                `WhatsApp: ${phone}`,
                `Serviço de interesse: ${service}`,
                `Mensagem: ${message}`
            ].filter(Boolean).join("\n");

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(url, "_blank", "noopener,noreferrer");
            contactForm.reset();

            if (feedback) {
                feedback.textContent = "Mensagem pronta no WhatsApp. Se a janela não abrir, verifique o bloqueador do navegador.";
            }
        });
    };

    const initHeaderState = () => {
        setHeaderState();
        window.addEventListener("scroll", setHeaderState, { passive: true });
    };

    const init = () => {
        initTheme();
        initMobileMenu();
        initRevealAnimations();
        initSectionObserver();
        initContactForm();
        initHeaderState();

        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
                const nextTheme = currentTheme === "dark" ? "light" : "dark";
                applyTheme(nextTheme, true);
            });
        }

        setHeaderState();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
