import { Source } from "./searchService";

const LEGAL_KEYWORDS = [
  "constitution",
  "article",
  "supreme court",
  "fundamental rights",
  "doctrine",
  "precedent",
  "judgment",
  "constitutional bench",
  "writ petition",
  "judicial review"
];

export function filterRelevantSources(sources: Source[]): Source[] {
  return sources.filter(source =>
    LEGAL_KEYWORDS.some(keyword =>
      source.content.toLowerCase().includes(keyword)
    )
  );
}