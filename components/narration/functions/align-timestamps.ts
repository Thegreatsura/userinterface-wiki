import type { WordTimestamp } from "../types";
import type { WordPosition } from "./collect-word-positions";

/**
 * Align timestamps to word positions
 */
export function alignTimestamps(
  timestamps: WordTimestamp[],
  positions: WordPosition[],
): number[] {
  const mapping: number[] = new Array(timestamps.length).fill(-1);
  let posIndex = 0;

  for (let i = 0; i < timestamps.length; i++) {
    const normalized = timestamps[i]?.normalized;
    if (!normalized) continue;

    for (let j = posIndex; j < positions.length; j++) {
      if (positions[j]?.normalized === normalized) {
        mapping[i] = j;
        posIndex = j + 1;
        break;
      }
    }
  }

  return mapping;
}
