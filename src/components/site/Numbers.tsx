import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { CONTACT, SOCIAL } from "./data";
import { CountUp, Reveal } from "./Reveal";
import { Hl, PhotoBackdrop, SectionTitle } from "./SectionTitle";

const numbersBg = "/images/fundo_numeros_particulas.webp";
const vivianeImg = "/images/viviane_andrade.webp";

const numbers = [
  { to: 7, suffix: "+", label: "Anos de Atuação" },
  { to: 304, suffix: "", label: "Empresas Conectadas" },
  { to: 100, suffix: "%", label: "Satisfação" },
  { to: 30, suffix: "", label: "Organizações Atendidas" },
];

export function Numbers() {
  return (
    <section id="numeros" className="surface-dark relative isolate overflow-hidden py-24 lg:py-28">
      <PhotoBackdrop src={numbersBg} className="-z-10" />
      <div className="container-site">
        <SectionTitle pill="Impacto" sub="Resultados que falam por si e parcerias que transformam negócios.">
          Nossos <Hl>Números</Hl>
        </SectionTitle>
        <dl className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {numbers.map((n, i) => (
            <Reveal key={n.label} delay={i * 100} className="glass rounded-3xl px-4 py-8 text-center">
              <dd className="font-display text-5xl font-bold text-leaf sm:text-6xl">
                <CountUp to={n.to} suffix={n.suffix} />
              </dd>
              <dt className="mt-3 text-sm font-medium text-muted-foreground">{n.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

const socials = [
  { href: SOCIAL.instagram, label: "Instagram", icon: Instagram },
  { href: SOCIAL.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: CONTACT.whatsappHref, label: "WhatsApp", icon: MessageCircle },
];

export function Leadership() {
  return (
    <section id="lideranca" className="relative overflow-hidden py-24 lg:py-32">
      <div className="glow-blob -right-40 top-1/4 h-96 w-96" aria-hidden />
      <div className="container-site relative">
        <SectionTitle pill="Equipe" sub="Conheça quem está à frente da Control Consultoria.">
          Nossa <Hl>Liderança</Hl>
        </SectionTitle>

        <Reveal
          delay={100}
          className="glass mx-auto mt-14 grid max-w-5xl overflow-hidden rounded-[2rem] md:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="grid place-items-center bg-indigo/70 p-10">
            <div className="rounded-full bg-leaf-gradient p-1.5 shadow-glow">
              <img
                src={vivianeImg}
                alt="Viviane Andrade, CEO e fundadora da Control Consultoria"
                width={1220}
                height={1007}
                loading="lazy"
                className="aspect-square w-56 rounded-full object-cover object-[55%_25%] sm:w-64"
              />
            </div>
          </div>
          <div className="p-8 sm:p-12">
            <h3 className="text-3xl font-semibold sm:text-4xl">Viviane Andrade</h3>
            <span className="pill mt-4">CEO &amp; Fundadora</span>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Liderando a Control Consultoria com expertise e paixão por descomplicar a vida do empresário. Desde 2019,
              Viviane transforma sua experiência em gestão empresarial em soluções práticas que geram resultados reais
              para seus clientes.
            </p>
            <ul className="mt-8 flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${label} (abre em nova aba)`}
                    className="grid h-12 w-12 place-items-center rounded-full border border-leaf/40 text-leaf transition-colors hover:bg-leaf hover:text-leaf-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
