(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  root.classList.add("js");
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");
  const menu = document.querySelector("[data-mobile-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
  const languageButtons = document.querySelectorAll("[data-language-option]");
  const languageSwitchers = document.querySelectorAll("[data-language-switcher]");
  const form = document.querySelector("[data-contact-form]");
  const feedback = document.querySelector("[data-form-feedback]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const THEME_KEY = "control-theme";
  const LANGUAGE_KEY = "control-language";
  const WHATSAPP_NUMBER = "5511961371183";
  const I18N = window.CONTROL_I18N || {};
  const defaultLanguage = I18N.defaultLanguage || "pt-BR";
  const translatableAttributes = ["aria-label", "alt", "placeholder", "content"];
  const textNodeSources = new WeakMap();
  const attributeSources = new WeakMap();
  const translatedTextNodes = [];
  let lastFocusedElement = null;
  let currentLanguage = defaultLanguage;
  const backgroundElements = menu ? [...body.children].filter((element) => element !== menu) : [];
  const accordionTimers = new WeakMap();

  const readStoredTheme = () => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return stored === "dark" || stored === "light" ? stored : null;
    } catch {
      return null;
    }
  };

  const normalizeLanguage = (language) => {
    const aliases = I18N.aliases || {};
    const normalized = aliases[String(language || "").toLowerCase()];
    return normalized && I18N.languages?.[normalized] ? normalized : null;
  };

  const readStoredLanguage = () => {
    try { return normalizeLanguage(localStorage.getItem(LANGUAGE_KEY)); }
    catch { return null; }
  };

  const getLanguageUI = () => I18N.ui?.[currentLanguage] || I18N.ui?.[defaultLanguage] || {};

  const translateFrom = (table, source, language = currentLanguage) => {
    if (!source || language === defaultLanguage) return source;
    const languageKey = language === "pt-BR" ? "pt-BR" : language;
    return I18N[table]?.[source]?.[languageKey] || source;
  };

  const collectTextNodes = () => {
    if (translatedTextNodes.length) return;
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const source = node.nodeValue;
        if (!source || !source.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const source = node.nodeValue;
      const leading = source.match(/^\s*/)?.[0] || "";
      const trailing = source.match(/\s*$/)?.[0] || "";
      const key = source.trim().replace(/\s+/g, " ");
      textNodeSources.set(node, { key, leading, trailing });
      translatedTextNodes.push(node);
    }
  };

  const collectAttributeSources = () => {
    const selector = translatableAttributes.map((attribute) => `[${attribute}]`).join(",");
    document.querySelectorAll(selector).forEach((element) => {
      const sources = attributeSources.get(element) || {};
      translatableAttributes.forEach((attribute) => {
        if (element.hasAttribute(attribute) && !sources[attribute]) sources[attribute] = element.getAttribute(attribute);
      });
      attributeSources.set(element, sources);
    });
  };

  const updateMetaLanguage = (language) => {
    const meta = I18N.meta?.[language] || I18N.meta?.[defaultLanguage];
    if (!meta) return;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", meta.locale);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.ogTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.ogDescription);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", meta.twitterTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", meta.twitterDescription);
  };

  const syncThemeToggleLabel = () => {
    if (!themeToggle) return;
    const ui = getLanguageUI();
    themeToggle.setAttribute("aria-label", root.dataset.theme === "dark"
      ? ui.themeLight || "Ativar tema claro"
      : ui.themeDark || "Ativar tema escuro");
  };

  const syncMenuToggleLabel = (isOpen = menu?.classList.contains("is-open")) => {
    if (!menuToggle) return;
    const ui = getLanguageUI();
    menuToggle.setAttribute("aria-label", isOpen ? ui.menuClose || "Fechar menu" : ui.menuOpen || "Abrir menu");
  };

  const syncLanguageControls = () => {
    const ui = getLanguageUI();
    languageSwitchers.forEach((switcher) => switcher.setAttribute("aria-label", ui.selectLanguage || "Selecionar idioma"));
    languageButtons.forEach((button) => {
      const language = normalizeLanguage(button.dataset.languageOption);
      const isSelected = language === currentLanguage;
      const label = I18N.languages?.[language]?.label || button.textContent.trim();
      button.setAttribute("aria-pressed", String(isSelected));
      button.setAttribute("aria-label", label);
      button.title = label;
    });
  };

  const setLanguage = (language, persist = false) => {
    const normalizedLanguage = normalizeLanguage(language) || defaultLanguage;
    currentLanguage = normalizedLanguage;
    root.lang = normalizedLanguage;
    root.dataset.lang = normalizedLanguage;
    collectTextNodes();
    collectAttributeSources();
    updateMetaLanguage(normalizedLanguage);
    translatedTextNodes.forEach((node) => {
      const source = textNodeSources.get(node);
      if (!source) return;
      node.nodeValue = `${source.leading}${translateFrom("text", source.key, normalizedLanguage)}${source.trailing}`;
    });
    document.querySelectorAll(translatableAttributes.map((attribute) => `[${attribute}]`).join(",")).forEach((element) => {
      const sources = attributeSources.get(element);
      if (!sources) return;
      translatableAttributes.forEach((attribute) => {
        if (sources[attribute]) element.setAttribute(attribute, translateFrom("attributes", sources[attribute], normalizedLanguage));
      });
    });
    syncLanguageControls();
    syncThemeToggleLabel();
    syncMenuToggleLabel();
    if (persist) {
      try { localStorage.setItem(LANGUAGE_KEY, normalizedLanguage); } catch { /* Storage may be unavailable. */ }
    }
    document.dispatchEvent(new CustomEvent("control:languagechange", { detail: { language: normalizedLanguage } }));
  };

  const setTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (themeIcon) {
      themeIcon.className = `ui-icon ${theme === "dark" ? "ui-icon-sun" : "ui-icon-moon"}`;
      themeIcon.setAttribute("aria-hidden", "true");
    }
    syncThemeToggleLabel();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0f1117" : "#f6f8fc");
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch { /* Storage may be unavailable. */ }
    }
  };

  const savedTheme = readStoredTheme();
  const savedLanguage = readStoredLanguage();
  const browserLanguage = normalizeLanguage(navigator.language);
  setTheme(savedTheme || (systemTheme.matches ? "dark" : "light"));
  setLanguage(savedLanguage || browserLanguage || defaultLanguage);

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageOption, true));
  });

  systemTheme.addEventListener("change", (event) => {
    if (!readStoredTheme()) setTheme(event.matches ? "dark" : "light");
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 10);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const focusableInMenu = () => menu
    ? [...menu.querySelectorAll('.mobile-panel a[href], .mobile-panel button:not([disabled])')]
      .filter((element) => element.offsetParent !== null)
    : [];

  const setBackgroundInert = (isInert) => {
    backgroundElements.forEach((element) => { element.inert = isInert; });
  };

  const focusDestination = (destination) => {
    if (!(destination instanceof HTMLElement)) return false;
    const focusTarget = destination.matches("h1, h2, h3")
      ? destination
      : destination.querySelector("h1, h2, h3") || destination;
    const hadTabIndex = focusTarget.hasAttribute("tabindex");
    if (!hadTabIndex) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    if (!hadTabIndex) {
      focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
    }
    return true;
  };

  const openMenu = () => {
    if (!menu || !menuToggle) return;
    lastFocusedElement = document.activeElement;
    menu.setAttribute("aria-hidden", "false");
    menu.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    syncMenuToggleLabel(true);
    menuToggle.querySelector("[data-menu-icon]")?.classList.replace("ui-icon-menu", "ui-icon-close");
    body.classList.add("menu-open");
    setBackgroundInert(true);
    window.requestAnimationFrame(() => menu.querySelector(".mobile-panel [data-menu-close]")?.focus());
  };

  const closeMenu = ({ restoreFocus = true, destination = null } = {}) => {
    if (!menu || !menuToggle || !menu.classList.contains("is-open")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    syncMenuToggleLabel(false);
    menuToggle.querySelector("[data-menu-icon]")?.classList.replace("ui-icon-close", "ui-icon-menu");
    body.classList.remove("menu-open");
    setBackgroundInert(false);
    if (!focusDestination(destination) && restoreFocus && lastFocusedElement instanceof HTMLElement) {
      const fallback = lastFocusedElement.offsetParent !== null
        ? lastFocusedElement
        : document.querySelector(".site-header .brand");
      fallback?.focus();
    }
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
  };

  menuToggle?.addEventListener("click", () => menu?.classList.contains("is-open") ? closeMenu() : openMenu());
  menuCloseButtons.forEach((button) => button.addEventListener("click", () => closeMenu()));
  menu?.querySelectorAll('.mobile-panel a[href]').forEach((link) => link.addEventListener("click", (event) => {
    const destination = link.hash ? document.querySelector(link.hash) : null;
    if (destination) {
      event.preventDefault();
      window.history.pushState(null, "", link.hash);
    }
    closeMenu({ restoreFocus: !destination, destination });
    destination?.scrollIntoView({ block: "start" });
  }));

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
    if (event.matches) closeMenu();
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
      window.clearTimeout(accordionTimers.get(panel));
      if (!isOpen) {
        panel.hidden = false;
        requestAnimationFrame(() => {
          if (button.getAttribute("aria-expanded") === "true") panel.classList.add("is-open");
        });
      } else {
        panel.classList.remove("is-open");
        const finish = () => {
          if (button.getAttribute("aria-expanded") === "false") panel.hidden = true;
          accordionTimers.delete(panel);
        };
        if (reduceMotion.matches) finish();
        else accordionTimers.set(panel, window.setTimeout(finish, 300));
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
    feedback.setAttribute("role", isError ? "alert" : "status");
    feedback.setAttribute("aria-live", isError ? "assertive" : "polite");
  };

  const isValidPhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  };

  const getFieldError = (field) => {
    const ui = getLanguageUI();
    if (field.validity.valueMissing) return ui.required || "Este campo é obrigatório.";
    if (field.validity.typeMismatch && field.name === "email") return ui.invalidEmail || "Informe um endereço de e-mail válido.";
    if (field.name === "phone" && !isValidPhone(field.value)) return ui.invalidPhone || "Informe um telefone ou WhatsApp válido.";
    return ui.required || "Este campo é obrigatório.";
  };

  const validateField = (field) => {
    const error = form?.querySelector(`[data-error-for="${field.name}"]`);
    const isValid = field.checkValidity() && (field.name !== "phone" || isValidPhone(field.value));
    if (isValid) field.removeAttribute("aria-invalid");
    else field.setAttribute("aria-invalid", "true");
    if (error) error.textContent = isValid ? "" : getFieldError(field);
    return isValid;
  };

  const updateInvalidField = (event) => {
    const field = event.target;
    if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)
      && field.hasAttribute("aria-invalid")) validateField(field);
  };

  form?.addEventListener("input", updateInvalidField);
  form?.addEventListener("change", updateInvalidField);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const requiredFields = [...form.querySelectorAll("[required]")];
    const invalidFields = requiredFields.filter((field) => !validateField(field));
    if (invalidFields.length) {
      const ui = getLanguageUI();
      invalidFields[0].focus();
      showFormFeedback(ui.prepareError || "Não foi possível preparar sua mensagem. Verifique os campos e tente novamente.", true);
      return;
    }

    const data = new FormData(form);
    const ui = getLanguageUI();
    const getValue = (name) => String(data.get(name) || "").trim();
    const lines = [
      ui.whatsappIntro || "Olá, gostaria de conversar com a Control Consultoria Empresarial.",
      "",
      `${ui.whatsappName || "Nome"}: ${getValue("name")}`,
      getValue("company") ? `${ui.whatsappCompany || "Empresa"}: ${getValue("company")}` : null,
      `${ui.whatsappEmail || "E-mail"}: ${getValue("email")}`,
      `${ui.whatsappPhone || "Telefone / WhatsApp"}: ${getValue("phone")}`,
      `${ui.whatsappService || "Serviço de interesse"}: ${getValue("service")}`,
      "",
      `${ui.whatsappMessage || "Mensagem"}: ${getValue("message")}`
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    const newWindow = window.open("about:blank", "_blank");
    if (newWindow) {
      newWindow.opener = null;
      newWindow.location.replace(url);
      showFormFeedback(ui.whatsappPrepared || "Mensagem preparada com sucesso. Você será direcionado ao WhatsApp para revisar e concluir o envio.");
      form.reset();
      form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
      form.querySelectorAll("[data-error-for]").forEach((error) => { error.textContent = ""; });
    } else {
      showFormFeedback(ui.whatsappBlocked || "Não foi possível preparar sua mensagem. Verifique os campos e tente novamente.", true);
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
