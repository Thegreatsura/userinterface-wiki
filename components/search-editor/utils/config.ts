import type { OperatorKey } from "./operator-token";

export const OPERATORS: OperatorKey[] = ["author", "tag", "sort"];

export const OPERATOR_CONFIG: Partial<
  Record<OperatorKey, { hint: string; example: string }>
> = {
  tag: { hint: "Filter by tag", example: "tag:animation" },
  author: { hint: "Filter by author", example: "author:John" },
  sort: { hint: "Sort results", example: "sort:oldest" },
};

export const SORT_OPTIONS = ["newest", "oldest", "a-z", "z-a"];

/**
 * Detect if the cursor is right after a typed operator (e.g., "author:")
 * Returns the operator key if found, null otherwise.
 */
export function detectTypedOperator(text: string): OperatorKey | null {
  const match = text.match(/(?:^|\s)(author|tag|sort):$/i);
  if (match) {
    return match[1].toLowerCase() as OperatorKey;
  }
  return null;
}
