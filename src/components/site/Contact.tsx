import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, ArrowUp, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import {
  buildContactMessage,
  validateContact,
  whatsappLink,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact-form";
import { Logo } from "./Logo";
import { CONTACT, NAV, SELECT_SERVICE_EVENT, SERVICES, SOCIAL } from "./data";
import { Reveal } from "./Reveal";
import { Hl, PhotoBackdrop } from "./SectionTitle";

const ctaBg = "/images/fundo_cta_escritorio.webp";

export function ContactCta() {
  return (
    <section id="fale-conosco" className="surface-dark relative isolate overflow-hidden py-24 lg:py-32">
      <PhotoBackdrop src={ctaBg} className="-z-10" />
      <div className="container-site">
        <Reveal className="glass mx-auto max-w-4xl rounded-[2rem] px-6 py-14 text-center shadow-lift sm:px-14 sm:py-20">
          <span className="pill">Primeiro passo</span>
          <h2 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Pronto para <Hl>simplificar</Hl> sua gestão?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Sua empresa não precisa resolver todos os desafios de uma vez. O primeiro passo é compreender o cenário,
            definir prioridades e construir um caminho possível.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-leaf">
              <MessageCircle className="h-5 w-5" aria-hidden />
              Fale pelo WhatsApp
            </a>
            <a href="#contato" className="btn btn-outline-light">
              Enviar uma mensagem
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const EMPTY: ContactValues = { name: "", company: "", email: "", phone: "", service: "", message: "" };
const FIELD_ORDER: (keyof ContactValues)[] = ["name", "email", "phone", "service", "message"];

export function ContactSection() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // "Quero saber mais" on a service card preselects that service here.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, service: title }));
      setErrors((er) => ({ ...er, service: undefined }));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const set = (key: keyof ContactValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setSent(false);
      return;
    }
    window.open(whatsappLink(CONTACT.whatsappNumber, buildContactMessage(values)), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const fieldProps = (key: keyof ContactValues) => ({
    id: `contato-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contato-${key}-erro` : undefined,
    className: "field mt-2",
  });

  const label = (key: keyof ContactValues, text: string, required = true) => (
    <label htmlFor={`contato-${key}`} className="text-sm font-semibold">
      {text}
      {required && <span className="text-leaf"> *</span>}
    </label>
  );

  const error = (key: keyof ContactValues) =>
    errors[key] ? (
      <p id={`contato-${key}-erro`} className="mt-1.5 text-sm font-medium text-destructive">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section id="contato" className="relative overflow-hidden py-24 lg:py-32">
      <div className="glow-blob -right-40 top-10 h-96 w-96" aria-hidden />
      <div className="container-site relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <Reveal className="glass rounded-[2rem] p-6 sm:p-10">
          <span className="pill">Contato</span>
          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            Conte brevemente sobre <Hl>sua empresa</Hl>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Os campos marcados com <span className="text-leaf">*</span> são obrigatórios.
          </p>

          <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              {label("name", "Nome")}
              <input {...fieldProps("name")} type="text" autoComplete="name" placeholder="Digite seu nome" />
              {error("name")}
            </div>
            <div>
              {label("company", "Empresa", false)}
              <input {...fieldProps("company")} type="text" autoComplete="organization" placeholder="Nome da empresa" />
            </div>
            <div>
              {label("email", "E-mail")}
              <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" placeholder="voce@empresa.com.br" />
              {error("email")}
            </div>
            <div>
              {label("phone", "Telefone / WhatsApp")}
              <input {...fieldProps("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="(11) 90000-0000" />
              {error("phone")}
            </div>
            <div className="sm:col-span-2">
              {label("service", "Serviço de interesse")}
              <select {...fieldProps("service")}>
                <option value="">Selecione uma opção</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Outro / ainda não sei">Outro / ainda não sei</option>
              </select>
              {error("service")}
            </div>
            <div className="sm:col-span-2">
              {label("message", "Mensagem")}
              <textarea {...fieldProps("message")} rows={5} placeholder="Como podemos ajudar?" />
              {error("message")}
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-leaf w-full sm:w-auto">
                <Send className="h-4 w-4" aria-hidden />
                Enviar pelo WhatsApp
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                Sua mensagem será preparada para envio pelo WhatsApp. Revise as informações antes de concluir.
              </p>
              <p role="status" className="mt-2 text-sm font-medium text-leaf">
                {sent ? "Pronto! Abrimos o WhatsApp com a sua mensagem. É só tocar em enviar." : ""}
              </p>
            </div>
          </form>
        </Reveal>

        <Reveal delay={100} className="lg:pt-6">
          <span className="pill">Contato direto</span>
          <h3 className="mt-5 text-2xl font-semibold sm:text-3xl">
            Fale com a <Hl>Control Consultoria</Hl>
          </h3>
          <p className="mt-3 text-muted-foreground">Atendimento empresarial mediante contato.</p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: MessageCircle, label: "WhatsApp", value: CONTACT.phoneDisplay, href: CONTACT.whatsappHref, external: true },
              { icon: Phone, label: "Telefone", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
              { icon: Mail, label: "E-mail", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: MapPin, label: "Localização", value: CONTACT.city },
            ].map(({ icon: Icon, label: l, value, href, external }) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf/15 text-leaf">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l}</span>
                    <span className="block break-all font-medium">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={l}>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="glass flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-leaf/60"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="glass flex items-center gap-4 rounded-2xl p-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

const socials = [
  { href: SOCIAL.instagram, label: "Instagram", icon: Instagram },
  { href: SOCIAL.facebook, label: "Facebook", icon: Facebook },
  { href: CONTACT.whatsappHref, label: "WhatsApp", icon: MessageCircle },
  { href: SOCIAL.linkedin, label: "LinkedIn", icon: Linkedin },
];

export function Footer() {
  return (
    <footer id="rodape" className="bg-footer-gradient border-t border-border">
      <div className="container-site grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-muted-foreground">Descomplicando a vida do empresário.</p>
          <ul className="mt-6 flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${label} (abre em nova aba)`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-leaf hover:text-leaf"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Navegação</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-block py-0.5 text-muted-foreground hover:text-leaf">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Serviços</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a href="#servicos" className="inline-block py-0.5 text-muted-foreground hover:text-leaf">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Contato</h3>
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            <li>
              <a href={CONTACT.phoneHref} className="flex items-center gap-3 hover:text-foreground">
                <Phone className="h-4 w-4 text-leaf" />
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 break-all hover:text-foreground">
                <Mail className="h-4 w-4 shrink-0 text-leaf" />
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-leaf" />
              {CONTACT.city}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site flex flex-col gap-2 py-6 pb-24 text-xs text-muted-foreground sm:pb-6 sm:pr-24 lg:flex-row lg:justify-between">
          <p>
            © {new Date().getFullYear()} Control Consultoria Gerenciamento Empresarial Ltda. Todos os direitos reservados.
            {" "}CNPJ {CONTACT.cnpj}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="font-medium text-leaf">Viviane Andrade - Control Consultoria</p>
            <a href="#inicio" className="inline-flex min-h-11 items-center gap-1.5 font-medium hover:text-leaf">
              Voltar ao topo
              <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar pelo WhatsApp"
      className="btn-leaf fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
