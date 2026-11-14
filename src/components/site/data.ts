import type { Challenge } from "@/lib/diagnosis";

const image = (name: string) => `/images/${name}`;

export const CONTACT = {
  phoneDisplay: "(11) 96137-1183",
  phoneHref: "tel:+5511961371183",
  whatsappNumber: "5511961371183",
  whatsappHref:
    "https://wa.me/5511961371183?text=" +
    encodeURIComponent("Olá! Vim pelo site da Control Consultoria e gostaria de saber mais."),
  email: "control01@outlook.com.br",
  city: "São Paulo - SP",
  legalName: "Control C Gerenciamento Empresarial LTDA",
  cnpj: "34.773.540/0001-20",
};

export const SOCIAL = {
  instagram: "https://www.instagram.com/controlconsultoria1/",
  facebook: "https://www.facebook.com/controlconsultoria1/",
  linkedin: "https://www.linkedin.com/company/control-c-gerenciamento-empresarial-ltda/",
};

export const NAV = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#metodologia", label: "Como trabalhamos" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

/** Four-pillar band shown under the hero. */
export const FOCUS = [
  { title: "Estratégia", text: "Direção para decidir." },
  { title: "Pessoas", text: "Desenvolvimento para evoluir." },
  { title: "Processos", text: "Organização para executar." },
  { title: "Gestão", text: "Clareza para acompanhar." },
];

export const FAQ = [
  {
    q: "Como iniciar um atendimento com a Control?",
    a: "Entre em contato pelo WhatsApp, por e-mail ou pelo formulário. A conversa inicial ajuda a compreender o cenário da empresa e identificar a solução mais adequada.",
  },
  {
    q: "Quais empresas podem contratar a Control?",
    a: "Empresas de diferentes segmentos e portes que precisam organizar sua gestão, aprimorar processos e desenvolver pessoas de maneira estruturada.",
  },
  {
    q: "A consultoria oferece soluções prontas?",
    a: "Não. Cada projeto parte da realidade do negócio para construir soluções aplicáveis, consistentes e alinhadas aos seus objetivos.",
  },
  {
    q: "Os treinamentos são personalizados?",
    a: "Sim. Os treinamentos são construídos conforme o perfil da equipe, os desafios atuais e os objetivos da empresa.",
  },
  {
    q: "Como funciona o acompanhamento?",
    a: "O acompanhamento depende da solução contratada e pode incluir alinhamentos periódicos, análise de avanços e ajustes necessários ao longo do trabalho.",
  },
  {
    q: "A Control atende pequenas empresas?",
    a: "Sim. O escopo é definido conforme a estrutura, as prioridades e o momento de cada empresa.",
  },
  {
    q: "É possível contratar apenas um serviço?",
    a: "Sim. A contratação pode ser direcionada a uma necessidade específica ou estruturada em um projeto mais amplo, conforme o diagnóstico realizado.",
  },
  {
    q: "A Control realiza atendimento presencial?",
    a: "O atendimento empresarial ocorre mediante contato e pode ser alinhado conforme a necessidade, a localização e o formato mais adequado ao projeto.",
  },
  {
    q: "Como é elaborado um orçamento?",
    a: "O orçamento é elaborado após a compreensão da necessidade, do escopo, da complexidade e das etapas envolvidas no trabalho.",
  },
  {
    q: "Ainda não sei qual serviço minha empresa precisa. Posso entrar em contato?",
    a: "Sim. A conversa inicial existe justamente para compreender o cenário, organizar prioridades e identificar o caminho mais adequado.",
  },
];

/** Fired by "Quero saber mais" on a service card so the contact form preselects it. */
export const SELECT_SERVICE_EVENT = "control:select-service";

export type ServiceCategory = "gestao" | "pessoas" | "rotina";

/** Filter chips above the service cards. */
export const SERVICE_CATEGORIES: { id: ServiceCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "gestao", label: "Estratégia & Gestão" },
  { id: "pessoas", label: "Pessoas" },
  { id: "rotina", label: "Rotina & Operação" },
];

export type Service = {
  id: string;
  category: ServiceCategory;
  title: string;
  description: string;
  tags: string[];
  details: string[];
  /** Free photo under the Unsplash License, shown behind the card. */
  image: string;
};

export const SERVICES: Service[] = [
  {
    id: "consultoria-empresarial",
    category: "gestao",
    image: image("servico_consultoria_aperto_mao.webp"),
    title: "Consultoria Empresarial",
    description:
      "Estratégia, desenvolvimento de negócios, gestão operacional e arquitetura corporativa para transformar desafios em oportunidades.",
    tags: ["Diagnóstico", "Planejamento", "Resultados"],
    details: [
      "Diagnóstico completo do negócio",
      "Planejamento estratégico e metas",
      "Reestruturação de processos",
      "Arquitetura e governança corporativa",
    ],
  },
  {
    id: "recrutamento-selecao",
    category: "pessoas",
    image: image("servico_recrutamento_entrevista.webp"),
    title: "Recrutamento & Seleção",
    description:
      "Processos seletivos inteligentes que conectam sua empresa aos melhores talentos, com análise de perfil e assessments.",
    tags: ["Triagem", "Entrevistas", "Fit Cultural"],
    details: [
      "Mapeamento e descrição de vagas",
      "Triagem e entrevistas por competência",
      "Assessments e análise de perfil",
      "Acompanhamento pós-contratação",
    ],
  },
  {
    id: "gestao-estrategica",
    category: "gestao",
    image: image("servico_gestao_graficos.webp"),
    title: "Gestão Estratégica",
    description:
      "Transformamos dados e números em estratégias de gestão para impulsionar o crescimento sustentável do seu negócio.",
    tags: ["KPIs", "Relatórios", "Custos"],
    details: [
      "Definição de indicadores (KPIs)",
      "Relatórios gerenciais periódicos",
      "Análise e redução de custos",
      "Painéis para tomada de decisão",
    ],
  },
  {
    id: "consultoria-humanizada",
    category: "pessoas",
    image: image("servico_humanizada_conversa.webp"),
    title: "Consultoria Humanizada",
    description:
      "Autoconhecimento, qualidade de vida emocional e desenvolvimento pessoal para transformar desafios em crescimento.",
    tags: ["Mentoria", "Equilíbrio", "Carreira"],
    details: [
      "Mentoria individual para líderes",
      "Equilíbrio entre vida e trabalho",
      "Planejamento de carreira",
      "Desenvolvimento de inteligência emocional",
    ],
  },
  {
    id: "departamento-pessoal",
    category: "rotina",
    image: image("servico_dp_documentos.webp"),
    title: "Departamento Pessoal",
    description:
      "Gestão completa de folha de pagamento, admissão, rescisão, eSocial e legislação trabalhista.",
    tags: ["eSocial", "Folha", "Conformidade"],
    details: [
      "Folha de pagamento e encargos",
      "Admissões, férias e rescisões",
      "Envio e gestão do eSocial",
      "Conformidade trabalhista e previdenciária",
    ],
  },
  {
    id: "treinamento-desenvolvimento",
    category: "pessoas",
    image: image("servico_treinamento_palestra.webp"),
    title: "Treinamento & Desenvolvimento",
    description:
      "Programas de capacitação personalizados para desenvolver talentos e impulsionar o desempenho da sua equipe.",
    tags: ["Liderança", "Equipes", "Resultados"],
    details: [
      "Formação de lideranças",
      "Treinamentos in company",
      "Workshops de alta performance",
      "Avaliação de desempenho",
    ],
  },
  {
    id: "apoio-administrativo",
    category: "rotina",
    image: image("servico_apoio_escritorio.webp"),
    title: "Apoio Administrativo",
    description:
      "Serviços combinados de escritório para que a rotina da sua empresa funcione com organização, agilidade e sem atritos.",
    tags: ["Rotinas", "Documentos", "Financeiro"],
    details: [
      "Organização documental e arquivos",
      "Rotinas financeiras e contas a pagar/receber",
      "Atendimento e secretariado",
      "Suporte administrativo sob demanda",
    ],
  },
  {
    id: "eventos-corporativos",
    category: "rotina",
    image: image("servico_eventos_conferencia.webp"),
    title: "Eventos Corporativos",
    description:
      "Organização de feiras, congressos, exposições e confraternizações — com coffee break e serviço de alimentação para receber bem.",
    tags: ["Feiras", "Congressos", "Coffee break"],
    details: [
      "Planejamento e produção do evento",
      "Feiras, congressos e exposições",
      "Confraternizações e festas corporativas",
      "Coffee break e alimentação",
    ],
  },
];

/** Four-step method: shown in the hero panel and in "Como trabalhamos". */
export const METHOD_STEPS = [
  {
    title: "Diagnóstico",
    text: "Análise aprofundada dos processos, finanças e operações da sua empresa para identificar oportunidades e desafios.",
    deliverable: "Mapa de oportunidades e desafios",
  },
  {
    title: "Planejamento",
    text: "Elaboração de um plano de ação personalizado com metas claras, indicadores e roadmap de implementação.",
    deliverable: "Plano de ação com metas e indicadores",
  },
  {
    title: "Implementação",
    text: "Acompanhamento ativo na execução das mudanças com suporte contínuo e ajustes necessários para garantir o resultado.",
    deliverable: "Mudanças executadas com suporte próximo",
  },
  {
    title: "Monitoramento",
    text: "Análise contínua dos resultados, otimização das estratégias e ajustes para garantir o crescimento sustentável.",
    deliverable: "Relatórios e ajustes contínuos",
  },
];

/** "Diagnóstico rápido": each challenge points to the services that answer it, most relevant first. */
export const CHALLENGES: Challenge[] = [
  { id: "crescer", label: "Quero crescer, mas não sei por onde começar", services: ["consultoria-empresarial", "gestao-estrategica"] },
  { id: "numeros", label: "Não tenho números claros para decidir", services: ["gestao-estrategica", "consultoria-empresarial"] },
  { id: "rotina", label: "A rotina da empresa está desorganizada", services: ["apoio-administrativo", "consultoria-empresarial"] },
  { id: "contratar", label: "Tenho dificuldade para contratar as pessoas certas", services: ["recrutamento-selecao"] },
  { id: "equipe", label: "A equipe precisa de preparo e motivação", services: ["treinamento-desenvolvimento", "consultoria-humanizada"] },
  { id: "lideranca", label: "A liderança está sobrecarregada", services: ["consultoria-humanizada", "treinamento-desenvolvimento"] },
  { id: "folha", label: "Folha, eSocial e obrigações trabalhistas", services: ["departamento-pessoal"] },
  { id: "evento", label: "Preciso organizar um evento da empresa", services: ["eventos-corporativos"] },
];
