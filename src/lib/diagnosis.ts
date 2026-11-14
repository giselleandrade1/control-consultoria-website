export type Challenge = {
  id: string;
  label: string;
  /** Service ids that answer this challenge, most relevant first. */
  services: string[];
};

/**
 * Ranks services for the selected challenges. The first service of a challenge
 * counts double; ties keep the order in which they were first suggested.
 */
export function recommendServices(selectedIds: string[], challenges: Challenge[]): string[] {
  const score = new Map<string, number>();
  for (const id of selectedIds) {
    const challenge = challenges.find((c) => c.id === id);
    challenge?.services.forEach((service, i) => {
      score.set(service, (score.get(service) ?? 0) + (i === 0 ? 2 : 1));
    });
  }
  return [...score.entries()].sort((a, b) => b[1] - a[1]).map(([service]) => service);
}

/** WhatsApp text with the chosen challenges and the suggested services. */
export function buildDiagnosisMessage(challengeLabels: string[], serviceTitles: string[]): string {
  return [
    "Olá! Fiz o diagnóstico rápido no site da Control Consultoria.",
    "",
    "Meus desafios hoje:",
    ...challengeLabels.map((l) => `- ${l}`),
    "",
    `Soluções sugeridas: ${serviceTitles.join(", ")}.`,
    "",
    "Gostaria de conversar sobre isso.",
  ].join("\n");
}
