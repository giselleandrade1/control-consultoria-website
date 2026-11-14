import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CONTACT, NAV } from "./data";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("#inicio");
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      let current = "#inicio";
      for (const item of NAV) {
        const el = document.querySelector(item.href);
        if (el && el.getBoundingClientRect().top <= 120) current = item.href;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Escape closes it, the page behind does not scroll, focus moves in and back.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "border-b border-border bg-background/92 backdrop-blur-md" : "surface-dark bg-transparent",
      )}
    >
      <div
        className="absolute left-0 top-0 h-0.5 bg-leaf transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
        aria-hidden
      />
      <div className="container-site flex h-18 items-center justify-between gap-3 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "location" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors xl:px-4",
                active === item.href ? "bg-leaf/15 text-leaf" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-leaf hidden px-5 py-2.5 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Fale Conosco
            <span className="sr-only">(abre o WhatsApp em nova aba)</span>
          </a>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-movel" className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-border lg:hidden">
          <nav className="container-site flex flex-col py-4" aria-label="Menu móvel">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                ref={i === 0 ? firstLink : undefined}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.href ? "location" : undefined}
                className={cn(
                  "border-b border-border py-4 font-display text-2xl last:border-0",
                  active === item.href ? "text-leaf" : "text-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-leaf mt-4 w-full"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp · {CONTACT.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
