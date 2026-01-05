"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  useDebounceCallback,
  useEventListener,
  useIsClient,
} from "usehooks-ts";
import {
  alignTimestamps,
  clearHighlight,
  collectWordPositions,
  highlightWord,
  scrollToWord,
  type WordPosition,
} from "../functions";
import { useNarrationStore } from "../store";
import type { WordTimestamp } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const BASE_WINDOW = 0.02;
const MAX_WINDOW = 0.12;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function resolveWindow(entry: WordTimestamp): number {
  const span = Math.max(
    BASE_WINDOW,
    Math.abs((entry.end ?? 0) - (entry.start ?? 0)),
  );
  return Math.min(MAX_WINDOW, span * 0.5);
}

function locateWordIndex(
  currentTime: number,
  timestamps: WordTimestamp[],
  lastIndex: number,
): number {
  if (!timestamps.length) return -1;

  const startOf = (entry: WordTimestamp) => entry.start ?? entry.end ?? 0;
  const endOf = (entry: WordTimestamp) => entry.end ?? entry.start ?? 0;

  const clampedLastIndex = Math.max(
    -1,
    Math.min(lastIndex, timestamps.length - 1),
  );

  if (clampedLastIndex >= 0) {
    const previous = timestamps[clampedLastIndex];
    if (previous) {
      const window = resolveWindow(previous);
      const prevStart = startOf(previous) - window;
      const prevEnd = endOf(previous) + window;

      if (currentTime >= prevStart && currentTime <= prevEnd) {
        return clampedLastIndex;
      }
    }
  }

  let index = clampedLastIndex;

  const firstTimestamp = timestamps[0];
  if (index === -1) {
    if (firstTimestamp && currentTime < startOf(firstTimestamp) - BASE_WINDOW) {
      return -1;
    }
    index = 0;
  }

  while (
    index + 1 < timestamps.length &&
    timestamps[index + 1] &&
    currentTime >= startOf(timestamps[index + 1] as WordTimestamp) - BASE_WINDOW
  ) {
    index += 1;
  }

  while (
    index > 0 &&
    timestamps[index] &&
    currentTime < startOf(timestamps[index] as WordTimestamp) - BASE_WINDOW
  ) {
    index -= 1;
  }

  const current = timestamps[index];
  if (!current) return index;

  const currentStart = startOf(current);
  const currentEnd = endOf(current);
  const window = resolveWindow(current);
  const withinCurrent =
    currentTime >= currentStart - window && currentTime <= currentEnd + window;

  if (withinCurrent) {
    return index;
  }

  if (currentTime > currentEnd + window) {
    if (index + 1 >= timestamps.length) {
      return timestamps.length - 1;
    }

    const nextTimestamp = timestamps[index + 1];
    if (nextTimestamp) {
      const nextStart = startOf(nextTimestamp);
      if (currentTime < nextStart - BASE_WINDOW) {
        return index;
      }
    }

    return index + 1;
  }

  if (currentTime < currentStart - window) {
    if (index === 0) {
      return -1;
    }
    return index - 1;
  }

  return index;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseWordHighlightOptions {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function useWordHighlight({ containerRef }: UseWordHighlightOptions) {
  const isClient = useIsClient();
  const wordPositionsRef = useRef<WordPosition[]>([]);
  const mappingRef = useRef<number[]>([]);
  const lastWordIndexRef = useRef(-1);
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const timestamps = useNarrationStore((state) => state.timestamps);
  const isPlaying = useNarrationStore((state) => state.isPlaying);
  const currentTime = useNarrationStore((state) => state.currentTime);
  const autoScroll = useNarrationStore((state) => state.autoScroll);

  // Collect word positions when container changes
  useEffect(() => {
    if (!containerRef.current) return;

    const timer = setTimeout(() => {
      if (containerRef.current) {
        wordPositionsRef.current = collectWordPositions(containerRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [containerRef]);

  // Align timestamps to word positions
  useEffect(() => {
    if (!timestamps.length || !wordPositionsRef.current.length) {
      mappingRef.current = [];
      return;
    }

    mappingRef.current = alignTimestamps(timestamps, wordPositionsRef.current);
  }, [timestamps]);

  // User scroll detection
  const resetUserScrolling = useDebounceCallback(() => {
    isUserScrollingRef.current = false;
  }, 800);

  const markScrolling = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    isUserScrollingRef.current = true;
    resetUserScrolling();
  }, [resetUserScrolling]);

  useEventListener("wheel", markScrolling, undefined, { passive: true });
  useEventListener("touchmove", markScrolling, undefined, { passive: true });

  // Visibility change sync
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible") return;
    lastWordIndexRef.current = -1;
  }, []);

  const documentRef = useRef<Document | null>(
    isClient ? document : null,
  ) as React.RefObject<Document>;

  useEventListener("visibilitychange", handleVisibilityChange, documentRef);

  // Apply word highlight
  const applyHighlight = useCallback(
    (wordIndex: number) => {
      highlightWord(wordPositionsRef.current, mappingRef.current, wordIndex);

      if (!autoScroll || isUserScrollingRef.current) return;

      isProgrammaticScrollRef.current = true;
      scrollToWord(wordPositionsRef.current, mappingRef.current, wordIndex);
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    },
    [autoScroll],
  );

  // Word highlighting during playback
  useEffect(() => {
    if (!timestamps.length || !isPlaying) return;

    const nextIndex = locateWordIndex(
      currentTime,
      timestamps,
      lastWordIndexRef.current,
    );

    if (nextIndex === lastWordIndexRef.current) return;

    lastWordIndexRef.current = nextIndex;

    if (nextIndex === -1) {
      clearHighlight();
      return;
    }

    applyHighlight(nextIndex);
  }, [applyHighlight, currentTime, isPlaying, timestamps]);

  // Clear highlight when paused
  useEffect(() => {
    if (isPlaying) return;
    lastWordIndexRef.current = -1;
    clearHighlight();
  }, [isPlaying]);

  return {
    resetWordIndex: () => {
      lastWordIndexRef.current = -1;
    },
  };
}
