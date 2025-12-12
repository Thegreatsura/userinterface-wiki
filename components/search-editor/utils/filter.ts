import { type LiqeQuery, parse, test } from "liqe";
import { extractSort, normalizeQuery, type SortOption } from "./serializer";

export interface FilterableDocument {
  title: string;
  author?: string;
  tag?: string | string[];
  date?: string | Date;
  [key: string]: unknown;
}

export interface FilterResult<T> {
  items: T[];
  sort: SortOption | null;
}

function prepareDocument<T extends FilterableDocument>(
  doc: T,
): Record<string, unknown> {
  const prepared: Record<string, unknown> = { ...doc };

  if (doc.date) {
    prepared.date =
      doc.date instanceof Date
        ? doc.date.toISOString().split("T")[0]
        : String(doc.date).split("T")[0];
  }

  if (doc.tag && !Array.isArray(doc.tag)) {
    prepared.tag = [doc.tag];
  }

  return prepared;
}

export function filterDocs<T extends FilterableDocument>(
  docs: T[],
  query: string,
): FilterResult<T> {
  const sort = extractSort(query);

  const filterQuery = query.replace(/sort:\S+/gi, "").trim();

  const normalized = normalizeQuery(filterQuery);

  if (normalized === "*" || !normalized) {
    return { items: [...docs], sort };
  }

  let parsedQuery: LiqeQuery;
  try {
    parsedQuery = parse(normalized);
  } catch (error) {
    console.warn("Failed to parse query:", normalized, error);
    return { items: [...docs], sort };
  }

  const filtered = docs.filter((doc) => {
    const prepared = prepareDocument(doc);
    try {
      return test(parsedQuery, prepared);
    } catch {
      return false;
    }
  });

  return { items: filtered, sort };
}

export function sortDocs<T extends FilterableDocument>(
  docs: T[],
  sort: SortOption | null,
): T[] {
  if (!sort) return docs;

  const sorted = [...docs];

  switch (sort) {
    case "newest":
      sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case "oldest":
      sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });
      break;
    case "a-z":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "z-a":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return sorted;
}

export function filterAndSortDocs<T extends FilterableDocument>(
  docs: T[],
  query: string,
): T[] {
  const { items, sort } = filterDocs(docs, query);
  return sortDocs(items, sort);
}
