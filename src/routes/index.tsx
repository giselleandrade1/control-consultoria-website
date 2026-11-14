import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { FocusBand, Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Differentials, Method } from "@/components/site/Method";
import { Leadership, Numbers } from "@/components/site/Numbers";
import { ContactCta, ContactSection, Footer, WhatsAppFloat } from "@/components/site/Contact";
import { Faq } from "@/components/site/Faq";

const TITLE = "Control Consultoria | Consultoria Empresarial em São Paulo";
const DESCRIPTION =
  "Consultoria empresarial, recrutamento & seleção, gestão estratégica, departamento pessoal e eventos corporativos em São Paulo. Descomplicando a vida do empresário desde 2019.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <FocusBand />
        <About />
        <Services />
        <Method />
        <Differentials />
        <Numbers />
        <Leadership />
        <Faq />
        <ContactCta />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
