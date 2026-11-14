export type ContactValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export type ContactErrors = { [K in keyof ContactValues]?: string | undefined };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Required: name, e-mail, phone/WhatsApp, service and message. Company is optional. */
export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const required = "Este campo é obrigatório.";
  if (!v.name.trim()) errors.name = required;
  if (!v.email.trim()) errors.email = required;
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "Informe um endereço de e-mail válido.";
  const digits = v.phone.replace(/\D/g, "");
  if (!digits) errors.phone = required;
  else if (digits.length < 10 || digits.length > 13) errors.phone = "Informe um telefone ou WhatsApp válido.";
  if (!v.service) errors.service = required;
  if (!v.message.trim()) errors.message = required;
  return errors;
}

/** Message text prepared for WhatsApp; empty optional fields are left out. */
export function buildContactMessage(v: ContactValues): string {
  const lines = [
    "Olá! Vim pelo site da Control Consultoria.",
    "",
    `Nome: ${v.name.trim()}`,
    v.company.trim() ? `Empresa: ${v.company.trim()}` : null,
    `E-mail: ${v.email.trim()}`,
    `Telefone / WhatsApp: ${v.phone.trim()}`,
    `Serviço de interesse: ${v.service}`,
    "",
    v.message.trim(),
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function whatsappLink(phoneE164Digits: string, text: string) {
  return `https://wa.me/${phoneE164Digits}?text=${encodeURIComponent(text)}`;
}

function formatLocal(d: string): string {
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
}

/** Formats a Brazilian phone while typing: (11) 96137-1183, (11) 3333-4444 or +55 (11) 96137-1183. */
export function formatPhoneBR(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 13);
  if (digits.length > 11) return `+${digits.slice(0, 2)} ${formatLocal(digits.slice(2))}`;
  return formatLocal(digits);
}
