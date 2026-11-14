import { MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT, FAQ } from "./data";
import { Reveal } from "./Reveal";
import { Hl, SectionTitle } from "./SectionTitle";

export function Faq() {
  return (
    <section id="duvidas" className="relative overflow-hidden py-24 lg:py-32">
      <div className="glow-blob -left-40 top-1/4 h-96 w-96" aria-hidden />
      <div className="container-site relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionTitle
            pill="Dúvidas frequentes"
            center={false}
            sub="Informações sobre o atendimento e a forma de trabalho da Control."
          >
            Respostas <Hl>claras</Hl> antes de começar
          </SectionTitle>
          <Reveal delay={100} className="glass mt-8 rounded-3xl p-6">
            <p className="font-semibold">Não encontrou sua dúvida?</p>
            <p className="mt-1 text-sm text-muted-foreground">Converse com a gente — a primeira conversa é para entender o seu cenário.</p>
            <a href={CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-leaf mt-5">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Perguntar pelo WhatsApp
            </a>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <Accordion type="single" collapsible className="border-t border-border">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`q${i}`} className="border-border">
                <AccordionTrigger className="min-h-14 gap-4 py-5 text-base font-semibold hover:no-underline hover:text-leaf sm:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-leaf">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pr-8 text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
