import { useState } from "react";
import {
  Briefcase,
  CalendarHeart,
  Check,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  LineChart,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SELECT_SERVICE_EVENT, SERVICES } from "./data";
import { Reveal } from "./Reveal";
import { Hl, SectionTitle } from "./SectionTitle";

const ICONS: Record<string, LucideIcon> = {
  "consultoria-empresarial": Briefcase,
  "recrutamento-selecao": UserSearch,
  "gestao-estrategica": LineChart,
  "consultoria-humanizada": HeartHandshake,
  "departamento-pessoal": Users,
  "treinamento-desenvolvimento": GraduationCap,
  "apoio-administrativo": ClipboardList,
  "eventos-corporativos": CalendarHeart,
};

export function Services() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="servicos" className="relative py-24 lg:py-32">
      <div className="container-site">
        <SectionTitle
          pill="O que fazemos"
          sub="Da consultoria estratégica à gestão de pessoas, temos tudo que seu negócio precisa para crescer."
        >
          Soluções <Hl>Completas</Hl> para sua Empresa
        </SectionTitle>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.id] ?? Briefcase;
            const open = openId === s.id;
            return (
              <Reveal
                key={s.id}
                delay={(i % 4) * 80}
                className={cn(
                  "surface-dark group relative isolate flex min-h-[26rem] flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300",
                  open ? "border-leaf shadow-lift" : "border-border hover:-translate-y-1 hover:border-leaf/50",
                )}
              >
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="overlay-card absolute inset-0 -z-10" aria-hidden />

                <span className="grid h-12 w-12 place-items-center rounded-xl bg-leaf/20 text-leaf backdrop-blur">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-auto pt-16">
                  <h3 className="text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={cn(
                      "grid transition-all duration-300",
                      open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <ul className="space-y-2 overflow-hidden" id={`detalhes-${s.id}`}>
                      {s.details.map((d) => (
                        <li key={d} className="flex gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : s.id)}
                      aria-expanded={open}
                      aria-controls={`detalhes-${s.id}`}
                      className="btn btn-outline-light min-h-11 px-4 py-2 text-xs"
                    >
                      {open ? "Fechar detalhes" : "Ver detalhes"}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                    </button>
                    <a
                      href="#contato"
                      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: s.title }))}
                      className="inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-semibold text-leaf hover:underline"
                    >
                      Quero saber mais
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">sobre {s.title}</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
