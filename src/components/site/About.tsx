import { ArrowRight, BookOpenCheck, CheckCircle2, Eye, Gem, Headphones, MapPin, Sparkles, Target } from "lucide-react";
import { Reveal } from "./Reveal";
import { Hl, SectionTitle } from "./SectionTitle";

const teamImg = "/images/colegas_comemorando.webp";

const features = [
  { icon: Headphones, title: "Atendimento Personalizado", text: "Equipe treinada para suporte ágil e soluções inteligentes." },
  { icon: BookOpenCheck, title: "Conhecimento Técnico", text: "Sempre atualizados com as melhores práticas do mercado." },
  { icon: Sparkles, title: "Inovação Constante", text: "Ferramentas modernas de gestão e tecnologia." },
];

const pillars = [
  {
    icon: Target,
    title: "Missão",
    text: "Transformar a consultoria em uma aliada estratégica para o sucesso dos nossos clientes, oferecendo soluções que geram resultados reais.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser referência em consultoria empresarial no Brasil, reconhecida pela excelência, inovação e compromisso com o crescimento dos nossos clientes.",
  },
  {
    icon: Gem,
    title: "Valores",
    text: "Ética, transparência, inovação, compromisso com o cliente e responsabilidade em cada projeto que realizamos.",
  },
];

export function About() {
  return (
    <section id="sobre" className="relative overflow-hidden py-24 lg:py-32">
      <div className="glow-blob -left-40 top-1/3 h-96 w-96" aria-hidden />
      <div className="container-site relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <span className="pill">Quem Somos</span>
          <h2 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Excelência em <Hl>Consultoria Empresarial</Hl>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            A <strong className="text-foreground">Control Consultoria</strong>, liderada por{" "}
            <strong className="text-foreground">Viviane Andrade</strong>, nasceu em{" "}
            <strong className="text-foreground">2019</strong> com o propósito de ajudar pequenos e médios empresários a
            superar os desafios da gestão e compreender o mundo corporativo de forma simples, prática e descomplicada.
          </p>
          <ul className="mt-8 space-y-3">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="glass flex gap-4 rounded-2xl p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf/15 text-leaf">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold">{title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="#servicos" className="btn btn-leaf mt-9">
            Saiba Mais
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-leaf/30" aria-hidden />
            <img
              src={teamImg}
              alt="Duas colegas comemorando com um 'toca aqui' em frente ao notebook"
              width={1200}
              height={800}
              loading="lazy"
              className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-lift"
            />
            <div className="absolute -bottom-6 right-4 border border-border bg-card text-card-foreground flex max-w-[17rem] items-start gap-3 rounded-2xl p-4 shadow-lift sm:right-6">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-leaf" aria-hidden />
              <div>
                <p className="text-sm font-semibold">Gestão com direção</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Clareza, método e proximidade para apoiar decisões.</p>
              </div>
            </div>
          </div>
          <p className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
            <span className="font-semibold text-leaf">Desde 2019</span>
            <span aria-hidden>·</span>
            <MapPin className="h-4 w-4 text-leaf" />
            São Paulo - SP
          </p>
        </Reveal>
      </div>

      <div className="container-site relative mt-28 lg:mt-36">
        <SectionTitle pill="Propósito" sub="Princípios que guiam cada ação e decisão na Control Consultoria.">
          Nossos <Hl>Pilares</Hl>
        </SectionTitle>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={i * 120}
              className="glass rounded-3xl p-8 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf/15 text-leaf">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
