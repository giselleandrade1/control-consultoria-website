import { Award, Clock, LineChart, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Reveal } from "./Reveal";
import { Hl, PhotoBackdrop, SectionTitle } from "./SectionTitle";

const methodBg = "/images/fundo_metodologia_quadro.webp";
const diffBg = "/images/fundo_diferenciais_quebracabeca.webp";

const steps = [
  { title: "Diagnóstico", text: "Análise aprofundada dos processos, finanças e operações da sua empresa para identificar oportunidades e desafios." },
  { title: "Planejamento", text: "Elaboração de um plano de ação personalizado com metas claras, indicadores e roadmap de implementação." },
  { title: "Implementação", text: "Acompanhamento ativo na execução das mudanças com suporte contínuo e ajustes necessários para garantir o resultado." },
  { title: "Monitoramento", text: "Análise contínua dos resultados, otimização das estratégias e ajustes para garantir o crescimento sustentável." },
];

const differentials = [
  { icon: Award, title: "Experiência Consolidada", text: "Know-how em consultoria empresarial adquirido ao longo de anos de atuação nos mais diversos segmentos do mercado." },
  { icon: UserCheck, title: "Atendimento Personalizado", text: "Cada cliente recebe uma solução desenhada exclusivamente para seu momento, necessidade e objetivo de negócio." },
  { icon: Users, title: "Equipe Multidisciplinar", text: "Profissionais especializados em diferentes áreas da gestão empresarial trabalhando em conjunto para o seu sucesso." },
  { icon: LineChart, title: "Resultados Mensuráveis", text: "Indicadores claros e relatórios periódicos que comprovam a evolução do seu negócio com dados reais." },
  { icon: Clock, title: "Redução de Tempo", text: "Processos ágeis que reduzem significativamente o tempo médio de contratação e implementação de soluções." },
  { icon: ShieldCheck, title: "Conformidade Total", text: "Todas as obrigações trabalhistas e previdenciárias cumpridas rigorosamente dentro dos prazos legais." },
];

export function Method() {
  return (
    <section id="metodologia" className="surface-dark relative isolate overflow-hidden py-24 lg:py-32">
      <PhotoBackdrop src={methodBg} className="-z-10" />
      <div className="container-site">
        <SectionTitle
          pill="Metodologia"
          sub="Uma metodologia comprovada em quatro etapas para transformar seu negócio com resultados mensuráveis."
        >
          Como <Hl>Trabalhamos</Hl>
        </SectionTitle>

        <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 120} className="relative">
              {i < steps.length - 1 && (
                <span className="absolute left-full top-12 hidden h-px w-5 bg-leaf lg:block" aria-hidden />
              )}
              <div className="glass h-full rounded-3xl p-7">
                <span className="font-display text-6xl font-bold leading-none text-leaf/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Differentials() {
  return (
    <section id="diferenciais" className="surface-dark relative isolate overflow-hidden py-24 lg:py-32">
      <PhotoBackdrop src={diffBg} className="-z-10" />
      <div className="container-site">
        <SectionTitle pill="Diferenciais" sub="Mais que consultoria, uma parceria comprometida com o crescimento do seu negócio.">
          Por que a <Hl>Control</Hl>?
        </SectionTitle>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={(i % 3) * 100}
              className="glass group rounded-3xl p-8 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf/15 text-leaf transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
