"use client";

import { AnimatePresence, motion } from "motion/react";
import { DotGrid1X3HorizontalIcon, PauseIcon, PlayIcon } from "@/icons";

import { useDocumentContext } from "./context";
import styles from "./styles.module.css";
import { formatDate } from "./utils";

interface HeaderProps {
  className?: string;
}

export const transition = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  transition: { duration: 0.15 },
} as const;

export function Header({ className }: HeaderProps) {
  const {
    page,
    author,
    coauthors,
    status,
    isPlaying,
    isPlayerVisible,
    togglePlayer,
    toggle,
  } = useDocumentContext("Header");

  const isReady = status === "ready";

  const handlePlayClick = () => {
    if (!isReady) return;

    if (isPlaying) {
      toggle();
    } else {
      if (!isPlayerVisible) {
        togglePlayer();
      }
      toggle();
    }
  };

  const hasCoauthors = coauthors.length > 0;

  return (
    <div className={className ?? styles.header}>
      <h1 className={styles.title}>{page.data.title}</h1>
      <div className={styles.metadata}>
        {formatDate(page.data.date.published)}&nbsp;by&nbsp;
        {author.name}
        {hasCoauthors && <span>&nbsp;and {coauthors.length} others</span>}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.action}
          onClick={handlePlayClick}
          disabled={!isReady}
          aria-label={
            isPlaying && isPlayerVisible ? "Hide player" : "Show player"
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlaying && isPlayerVisible ? (
              <motion.div {...transition} key="pause">
                <PauseIcon size={16} />
              </motion.div>
            ) : (
              <motion.div {...transition} key="play">
                <PlayIcon size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        <button type="button" className={styles.action}>
          <DotGrid1X3HorizontalIcon size={16} />
        </button>
      </div>
    </div>
  );
}
