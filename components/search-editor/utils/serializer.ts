import type { JSONContent } from "@tiptap/react";

interface OperatorTokenNode {
  type: "operatorToken";
  attrs: { key: string };
}

interface ValueTokenNode {
  type: "valueToken";
  attrs: { value: string; valid?: boolean; negated?: boolean };
}

interface TextNode {
  type: "text";
  text: string;
}

type ContentNode = OperatorTokenNode | ValueTokenNode | TextNode | JSONContent;

/**
 * Serialize the Tiptap JSON document into a query string.
 *
 * The output follows a simple format:
 * - OperatorToken + ValueToken pairs become "operator:value"
 * - Negated values become "-operator:value"
 * - Plain text is passed through as-is
 *
 * @example
 * serializeQuery(editor.getJSON())
 *
 */
export function serializeQuery(doc: JSONContent): string {
  const parts: string[] = [];

  function walk(node: ContentNode) {
    if (!node) return;

    if (node.type === "operatorToken") {
      const opNode = node as OperatorTokenNode;
      parts.push(`${opNode.attrs.key}:`);
    } else if (node.type === "valueToken") {
      const valNode = node as ValueTokenNode;
      const prefix = valNode.attrs.negated ? "-" : "";

      const value = valNode.attrs.value.includes(" ")
        ? `"${valNode.attrs.value}"`
        : valNode.attrs.value;

      const lastPart = parts[parts.length - 1];
      if (lastPart?.endsWith(":")) {
        parts[parts.length - 1] = `${prefix}${lastPart}${value}`;
      } else {
        parts.push(value);
      }
    } else if (node.type === "text") {
      const textNode = node as TextNode;
      const text = textNode.text.trim();
      if (text) parts.push(text);
    } else if (node.type === "paragraph" || node.type === "doc") {
      const children = (node as JSONContent).content ?? [];
      for (const child of children) {
        walk(child);
      }
    }
  }

  walk(doc);

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Normalize a query string for use with liqe.
 *
 * Transforms operator:value pairs into liqe-compatible syntax:
 * - "author:john" → "author:john"
 * - 'author:"John Doe"' → 'author:"John Doe"'
 * - "-tag:old" → "NOT tag:old"
 * - Plain text is wrapped as a title search
 */
export function normalizeQuery(query: string): string {
  if (!query.trim()) return "*";

  const tokenRegex = /(-?\w+:"[^"]*"|-?\w+:\S+|\S+)/g;
  const tokens = query.match(tokenRegex) ?? [];
  const normalized: string[] = [];

  for (const token of tokens) {
    if (token.startsWith("-")) {
      const inner = token.slice(1);
      const colonIndex = inner.indexOf(":");
      if (colonIndex !== -1) {
        const op = inner.slice(0, colonIndex);
        const val = inner.slice(colonIndex + 1);
        normalized.push(`NOT ${normalizeOperator(op, val)}`);
        continue;
      }
    }

    const colonIndex = token.indexOf(":");
    if (colonIndex !== -1) {
      const op = token.slice(0, colonIndex);
      const val = token.slice(colonIndex + 1);
      if (val) {
        normalized.push(normalizeOperator(op, val));
        continue;
      }
    }

    if (token) {
      normalized.push(`title:${token}`);
    }
  }

  return normalized.join(" AND ") || "*";
}

function normalizeOperator(op: string, val: string): string {
  switch (op.toLowerCase()) {
    case "sort":
      return "";
    default:
      return `${op}:${val}`;
  }
}

export type SortOption = "newest" | "oldest" | "a-z" | "z-a";

export function extractSort(query: string): SortOption | null {
  const match = query.match(/sort:(\S+)/i);
  if (!match) return null;

  const val = match[1].toLowerCase();
  if (val === "newest" || val === "oldest" || val === "a-z" || val === "z-a") {
    return val;
  }
  return null;
}
