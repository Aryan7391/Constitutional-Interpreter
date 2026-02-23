import { fetchSources } from "./searchService";
import { filterRelevantSources } from "./constitutionalReasoner";
import { callGroq } from "./groqService";
import { needsReasoning } from "../utils/needsReasoning";

export async function handleQuery(query: string) {

  console.log("Retrieving sources...\n");

  const sources = await fetchSources(query);
  const relevantSources = filterRelevantSources(sources);

  if (!needsReasoning(query)) {
    return { sources: relevantSources };
  }

  const compiledTextRaw = relevantSources
  .map(s => `${s.title}\n${s.content}`)
  .join("\n\n");

const compiledText = trimToTokenSafeLength(compiledTextRaw);

  const structuredPrompt = `
Answer using the following structure:

1 Constitutional Issue
2 Relevant Constitutional Provisions
3 Landmark Precedents
4 Legal Doctrines Applied
5 Structured Legal Reasoning
6 Constitutional Conclusion

Query: ${query}

Sources:
${compiledText}
`;

  const analysis = await callGroq(structuredPrompt);

  return { analysis, sources: relevantSources };
}

function trimToTokenSafeLength(text: string, maxChars: number = 12000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars);
}