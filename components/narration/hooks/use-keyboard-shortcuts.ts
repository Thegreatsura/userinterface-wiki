"use client";

import { useCallback } from "react";
import { useEventListener } from "usehooks-ts";
import { useNarrationStore } from "../store";

interface UseKeyboardShortcutsOptions {
  toggle: () => Promise<void>;
  seek: (time: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export function useKeyboardShortcuts({
  toggle,
  seek,
  audioRef,
}: UseKeyboardShortcutsOptions) {
  const toggleMute = useNarrationStore((state) => state.toggleMute);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          toggle();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(audio.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(audio.currentTime + 5);
          break;
        case "KeyJ":
          e.preventDefault();
          seek(audio.currentTime - 15);
          break;
        case "KeyL":
          e.preventDefault();
          seek(audio.currentTime + 15);
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
      }
    },
    [toggle, seek, toggleMute, audioRef],
  );

  useEventListener("keydown", handleKeyDown);
}
