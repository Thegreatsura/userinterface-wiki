import type { WordPosition } from "./collect-word-positions";
import { getOverlay } from "./overlay";

/**
 * Scroll the highlighted word into view
 */
export function scrollToWord(
  positions: WordPosition[],
  mapping: number[],
  wordIndex: number,
): void {
  const posIndex = mapping[wordIndex];
  if (typeof posIndex !== "number" || posIndex < 0) return;

  const pos = positions[posIndex];
  if (!pos) return;

  try {
    const range = new Range();
    range.setStart(pos.node, pos.start);
    range.setEnd(pos.node, pos.end);

    const rect = range.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const topThreshold = viewportHeight * 0.3;
    const bottomThreshold = viewportHeight * 0.7;

    if (rect.top < topThreshold || rect.bottom > bottomThreshold) {
      const scrollTarget = window.scrollY + rect.top - viewportHeight / 2;
      window.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  } catch {
    const overlayElement = getOverlay();
    if (overlayElement?.classList.contains("visible")) {
      const rect = overlayElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const topThreshold = viewportHeight * 0.3;
      const bottomThreshold = viewportHeight * 0.7;

      if (rect.top < topThreshold || rect.bottom > bottomThreshold) {
        const scrollTarget = window.scrollY + rect.top - viewportHeight / 2;
        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }
  }
}
