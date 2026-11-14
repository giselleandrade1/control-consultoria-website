import { describe, expect, it } from "vitest";
import { buildContactMessage, validateContact, whatsappLink, type ContactValues } from "@/lib/contact-form";

const ok: ContactValues = {
  name: "Ana",
  company: "",
  email: "ana@empresa.com.br",
  phone: "(11) 96137-1183",
  service: "Departamento Pessoal",
  message: "Quero organizar a folha.",
};

describe("contact form", () => {
  it("accepts a complete form without company", () => {
    expect(validateContact(ok)).toEqual({});
  });

  it("requires name, e-mail, phone, service and message", () => {
    const errors = validateContact({ name: "", company: "", email: "", phone: "", service: "", message: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name", "phone", "service"]);
  });

  it("rejects an invalid e-mail and a too-short phone", () => {
    const errors = validateContact({ ...ok, email: "ana@", phone: "1234" });
    expect(errors.email).toBe("Informe um endereço de e-mail válido.");
    expect(errors.phone).toBe("Informe um telefone ou WhatsApp válido.");
  });

  it("builds the WhatsApp message and leaves out an empty company", () => {
    const text = buildContactMessage(ok);
    expect(text).toContain("Serviço de interesse: Departamento Pessoal");
    expect(text).not.toContain("Empresa:");
    expect(whatsappLink("5511961371183", "Oi")).toBe("https://wa.me/5511961371183?text=Oi");
  });
});
