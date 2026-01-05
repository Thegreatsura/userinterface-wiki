"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useNarrationStore } from "../store";
import type { WordTimestamp } from "../types";

interface UseNarrationFetchOptions {
  slug: string;
  preferencesLoaded: boolean;
}

export function useNarrationFetch({
  slug,
  preferencesLoaded,
}: UseNarrationFetchOptions) {
  const {
    setAudioData,
    setStatus,
    setError,
    setIsPlaying,
    setCurrentTime,
    setDuration,
  } = useNarrationStore(
    useShallow((state) => ({
      setAudioData: state.setAudioData,
      setStatus: state.setStatus,
      setError: state.setError,
      setIsPlaying: state.setIsPlaying,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
    })),
  );

  useEffect(() => {
    if (!slug || !preferencesLoaded) return;

    const controller = new AbortController();

    const fetchNarration = async () => {
      setStatus("loading");
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioData({ audioUrl: null, timestamps: [] });

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          signal: controller.signal,
        });

        if (!response.ok) {
          setAudioData({ audioUrl: null, timestamps: [] });
          setStatus("unavailable");
          return;
        }

        const pageData = (await response.json()) as {
          audioUrl: string;
          timestamps: WordTimestamp[];
        };

        setAudioData({
          audioUrl: pageData.audioUrl ?? null,
          timestamps: pageData.timestamps ?? [],
        });
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[narration]", error);
        setAudioData({ audioUrl: null, timestamps: [] });
        setIsPlaying(false);
        setError("Audio unavailable");
        setStatus("error");
      }
    };

    fetchNarration();

    return () => controller.abort();
  }, [
    slug,
    preferencesLoaded,
    setAudioData,
    setError,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setStatus,
  ]);
}
