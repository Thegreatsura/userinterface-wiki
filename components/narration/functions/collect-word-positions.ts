import { normalizeWord } from "@/lib/strings";

export interface WordPosition {
  node: Text;
  start: number;
  end: number;
  normalized: string;
}

const SKIP_TAGS = new Set([
  "code",
  "pre",
  "kbd",
  "var",
  "samp",
  "style",
  "script",
  "figure",
  "figcaption",
]);

/**
 * Collect all text nodes from the article, building word positions on-demand.
 */
export function collectWordPositions(container: HTMLElement): WordPosition[] {
  const positions: WordPosition[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let node = walker.nextNode() as Text | null;
  while (node) {
    let skip = false;
    let parent = node.parentElement;
    while (parent && parent !== container) {
      if (SKIP_TAGS.has(parent.tagName.toLowerCase())) {
        skip = true;
        break;
      }
      if (parent.dataset.footnotes !== undefined) {
        skip = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (skip) {
      node = walker.nextNode() as Text | null;
      continue;
    }

    const text = node.textContent ?? "";
    if (!text.trim()) {
      node = walker.nextNode() as Text | null;
      continue;
    }

    const regex = /\S+/g;
    let match = regex.exec(text);
    while (match !== null) {
      const normalized = normalizeWord(match[0]);
      if (normalized) {
        positions.push({
          node,
          start: match.index,
          end: match.index + match[0].length,
          normalized,
        });
      }
      match = regex.exec(text);
    }
    node = walker.nextNode() as Text | null;
  }

  return positions;
}
