import { describe, expect, it } from "vitest";
import { buildDiagnosisMessage, recommendServices } from "@/lib/diagnosis";
import { matchesQuery } from "@/lib/text";
import { formatPhoneBR } from "@/lib/contact-form";
import { CHALLENGES, SERVICES } from "@/components/site/data";

describe("diagnóstico rápido", () => {
  it("every challenge points only to services that exist", () => {
    const ids = new Set(SERVICES.map((s) => s.id));
    for (const c of CHALLENGES) for (const s of c.services) expect(ids.has(s)).toBe(true);
  });

  it("ranks the service shared by several challenges first", () => {
    expect(recommendServices(["rotina", "numeros"], CHALLENGES)).toEqual([
      "apoio-administrativo",
      "gestao-estrategica",
      "consultoria-empresarial",
    ]);
  });

  it("recommends nothing when no challenge is selected", () => {
    expect(recommendServices([], CHALLENGES)).toEqual([]);
  });

  it("lists challenges and suggested services in the WhatsApp text", () => {
    const text = buildDiagnosisMessage(["A liderança está sobrecarregada"], ["Consultoria Humanizada"]);
    expect(text).toContain("- A liderança está sobrecarregada");
    expect(text).toContain("Soluções sugeridas: Consultoria Humanizada.");
  });
});

describe("busca nas dúvidas", () => {
  it("ignores accents and case", () => {
    expect(matchesQuery("Como é elaborado um orçamento?", "ORCAMENTO")).toBe(true);
  });
  it("requires every word", () => {
    expect(matchesQuery("Os treinamentos são personalizados?", "treinamento presencial")).toBe(false);
  });
});

describe("telefone", () => {
  it("formats mobile, landline and +55 numbers", () => {
    expect(formatPhoneBR("11961371183")).toBe("(11) 96137-1183");
    expect(formatPhoneBR("1133334444")).toBe("(11) 3333-4444");
    expect(formatPhoneBR("5511961371183")).toBe("+55 (11) 96137-1183");
  });
});
