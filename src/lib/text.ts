/** Lowercase and strip accents so "orcamento" finds "orçamento". */
export function normalizeText(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** True when every word of the query appears in the text (accent- and case-insensitive). */
export function matchesQuery(text: string, query: string): boolean {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeText(text);
  return words.every((w) => haystack.includes(w));
}
