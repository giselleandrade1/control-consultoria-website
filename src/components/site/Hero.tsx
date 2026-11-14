import { ArrowRight, ChevronDown, MapPin, MessageCircle } from "lucide-react";
// Free photo under the Unsplash License.
import heroBg from "@/assets/fundo_escritorio_aberto.webp.asset.json";
import { CONTACT, FOCUS } from "./data";
import { LogoMark } from "./Logo";

const stats = [
  { value: "7+", label: "Anos de Atuação" },
  { value: "304", label: "Empresas Conectadas" },
  { value: "100%", label: "Dedicação" },
];

export function Hero() {
  return (
    <section id="inicio" className="surface-dark relative flex min-h-svh items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img src={heroBg.url} alt="" className="h-full w-full object-cover" />
        <div className="overlay-hero absolute inset-0" />
      </div>
      <div className="glow-blob -right-40 top-10 h-96 w-96" aria-hidden />

      <div className="container-site relative grid items-center gap-14 pb-28 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:pt-36">
        <div className="animate-rise">
          <span className="pill">Consultoria Empresarial</span>
          <h1 className="mt-6 text-[2.6rem] font-bold leading-[1.08] sm:text-6xl lg:text-7xl">
            Descomplicando a <span className="text-leaf">vida do empresário</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Soluções em consultoria empresarial, recrutamento &amp; seleção e gestão estratégica para o seu negócio
            crescer com segurança.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-leaf">
              <MessageCircle className="h-4 w-4" />
              Fale Conosco
            </a>
            <a href="#servicos" className="btn btn-outline-leaf">
              Nossos Serviços
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="glass mx-auto w-full max-w-md animate-rise rounded-3xl p-7 shadow-lift [animation-delay:150ms] sm:p-8">
          <div className="flex items-center gap-4">
            <LogoMark className="h-14" />
            <div>
              <p className="font-display text-2xl font-bold">Control Consultoria</p>
              <p className="mt-1 text-sm text-muted-foreground">Liderada por Viviane Andrade</p>
            </div>
          </div>
          <dl className="mt-7 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-navy/40 px-2 py-4 text-center">
                <dd className="font-display text-2xl font-bold text-leaf sm:text-3xl">{s.value}</dd>
                <dt className="mt-1 text-[0.7rem] leading-tight text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-leaf" />
            {CONTACT.city}
          </div>
        </div>
      </div>

      <a
        href="#sobre"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:flex"
      >
        Role para explorar
        <ChevronDown className="h-5 w-5 animate-nudge text-leaf" />
      </a>
    </section>
  );
}

/** "Estratégia · Pessoas · Processos · Gestão" band right under the hero. */
export function FocusBand() {
  return (
    <section aria-label="Gestão com direção" className="bg-band-gradient border-y border-border">
      <ul className="container-site grid grid-cols-2 lg:grid-cols-4">
        {FOCUS.map((f, i) => (
          <li
            key={f.title}
            className={[
              "border-border px-4 py-6 sm:px-6 sm:py-7",
              i % 2 === 1 ? "border-l" : "",
              i >= 2 ? "border-t lg:border-t-0" : "",
              i === 2 ? "lg:border-l" : "",
            ].join(" ")}
          >
            <p className="flex items-center gap-2 font-display text-xl font-semibold sm:text-2xl">
              <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden />
              {f.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
