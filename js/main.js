(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const menu = document.querySelector("[data-mobile-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
  const form = document.querySelector("[data-contact-form]");
  const feedback = document.querySelector("[data-form-feedback]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const THEME_KEY = "control-theme";
  const WHATSAPP_NUMBER = "5511961371183";
  let lastFocusedElement = null;

  const readStoredTheme = () => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return stored === "dark" || stored === "light" ? stored : null;
    } catch {
      return null;
    }
  };

  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (themeIcon) {
      themeIcon.className = `ui-icon ${theme === "dark" ? "ui-icon-sun" : "ui-icon-moon"}`;
      themeIcon.setAttribute("aria-hidden", "true");
    }
    if (themeToggle) themeToggle.setAttribute("aria-label", theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#14132f" : "#f8fafc");
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch { /* Storage may be unavailable. */ }
    }
  };

  const savedTheme = readStoredTheme();
  setTheme(savedTheme || (systemTheme.matches ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  systemTheme.addEventListener("change", (event) => {
    if (!readStoredTheme()) setTheme(event.matches ? "dark" : "light");
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 10);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const focusableInMenu = () => menu ? [...menu.querySelectorAll('a[href], button:not([disabled])')].filter((element) => element.offsetParent !== null) : [];

  const openMenu = () => {
    if (!menu || !menuToggle) return;
    lastFocusedElement = document.activeElement;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
    menuToggle.querySelector("[data-menu-icon]")?.classList.replace("ui-icon-menu", "ui-icon-close");
    body.classList.add("menu-open");
    window.requestAnimationFrame(() => focusableInMenu()[0]?.focus());
  };

  const closeMenu = (restoreFocus = true) => {
    if (!menu || !menuToggle || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuToggle.querySelector("[data-menu-icon]")?.classList.replace("ui-icon-close", "ui-icon-menu");
    body.classList.remove("menu-open");
    if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  menuToggle?.addEventListener("click", () => menu?.classList.contains("is-open") ? closeMenu() : openMenu());
  menuCloseButtons.forEach((button) => button.addEventListener("click", () => closeMenu()));
  menu?.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", () => closeMenu(false)));

  document.addEventListener("keydown", (event) => {
    if (!menu?.classList.contains("is-open")) return;
    if (event.key === "Escape") return closeMenu();
    if (event.key !== "Tab") return;
    const focusable = focusableInMenu();
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });

  window.matchMedia("(min-width: 1101px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu(false);
  });

  document.querySelectorAll("[data-accordion] button").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (button.getAttribute("aria-expanded") === "true" && panel) {
      panel.hidden = false;
      panel.classList.add("is-open");
    }

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      if (!panel) return;
      if (!isOpen) {
        panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add("is-open"));
      } else {
        panel.classList.remove("is-open");
        const finish = () => { panel.hidden = true; panel.removeEventListener("transitionend", finish); };
        if (reduceMotion.matches) finish(); else panel.addEventListener("transitionend", finish);
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -7%" });
    revealElements.forEach((element) => revealObserver.observe(element));
    // Safety fallback: content must never remain hidden if an unusual viewport
    // prevents IntersectionObserver from reporting an entry.
    window.setTimeout(() => revealElements.forEach((element) => element.classList.add("is-visible")), 1200);
  }

  const navLinks = document.querySelectorAll('.desktop-nav a[href^="#"]');
  const observedSections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-30% 0px -60%", threshold: 0 });
    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = form?.elements.namedItem("service");
      if (select instanceof HTMLSelectElement) select.value = link.dataset.service || "";
    });
  });

  const showFormFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.toggle("is-error", isError);
  };

  form?.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
      event.target.removeAttribute("aria-invalid");
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = [...form.elements].filter((field) => field instanceof HTMLElement && "checkValidity" in field && !field.checkValidity());
    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    if (invalidFields.length) {
      invalidFields.forEach((field) => field.setAttribute("aria-invalid", "true"));
      invalidFields[0].focus();
      showFormFeedback("Revise os campos obrigatórios antes de enviar.", true);
      return;
    }

    const data = new FormData(form);
    const lines = [
      "Olá, gostaria de conversar com a Control Consultoria.",
      `Nome: ${String(data.get("name")).trim()}`,
      String(data.get("company") || "").trim() ? `Empresa: ${String(data.get("company")).trim()}` : null,
      `E-mail: ${String(data.get("email")).trim()}`,
      `Telefone: ${String(data.get("phone")).trim()}`,
      `Serviço de interesse: ${String(data.get("service")).trim()}`,
      `Mensagem: ${String(data.get("message")).trim()}`
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      showFormFeedback("Mensagem preparada no WhatsApp. Você pode revisar antes de enviar.");
      form.reset();
    } else {
      showFormFeedback("Não foi possível abrir o WhatsApp. Verifique o bloqueador de pop-ups.", true);
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
