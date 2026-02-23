import axios from "axios";

export interface Source {
  title: string;
  url: string;
  content: string;
}

const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || "http://localhost:8000";

export async function fetchSources(query: string): Promise<Source[]> {
  if (cache.has(query)) {
    console.log("Returning cached sources.");
    return cache.get(query);
  }

  const response = await axios.post(`${SEARCH_SERVICE_URL}/search`, {
    query,
    max_results: 3
  });

  cache.set(query, response.data.sources);

  return response.data.sources;
}

const cache = new Map<string, any>();
