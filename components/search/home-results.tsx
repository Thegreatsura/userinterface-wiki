"use client";

import { clsx } from "clsx";
import Link from "next/link";

import { Code } from "@/components/icons";

import { useSearchContext } from "./context";
import styles from "./home.module.css";
import type { SerializedPage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Search Results List
// ─────────────────────────────────────────────────────────────────────────────

export function SearchResultsList() {
  const { state, actions } = useSearchContext();
  const { filteredPages } = state;

  return (
    <>
      <div className={styles.resultcount}>
        {filteredPages.length}{" "}
        {filteredPages.length === 1 ? "article" : "articles"}
      </div>

      <div className={styles.posts}>
        {filteredPages.length === 0 ? (
          <NoResults onClear={() => actions.clearAll()} />
        ) : (
          filteredPages.map((page) => (
            <ArticleCard key={page.url} page={page} />
          ))
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// No Results
// ─────────────────────────────────────────────────────────────────────────────

interface NoResultsProps {
  onClear: () => void;
}

function NoResults({ onClear }: NoResultsProps) {
  return (
    <div className={styles.noresults}>
      <p>No articles match your search.</p>
      <button type="button" onClick={onClear} className={styles.clearbutton}>
        Clear filters
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Article Card
// ─────────────────────────────────────────────────────────────────────────────

interface ArticleCardProps {
  page: SerializedPage;
}

function ArticleCard({ page }: ArticleCardProps) {
  return (
    <Link href={{ pathname: page.url }} className={clsx(styles.post)}>
      <div className={styles.details}>
        <div className={styles.preview}>
          <Code />
        </div>
        <div>
          <h2 className={styles.cardtitle}>{page.title}</h2>
          <span className={styles.meta}>
            <span>{page.author.name}</span>
            <span className={styles.separator} />
            <span>{page.date.published}</span>
          </span>
        </div>
      </div>
      <div>
        <p className={styles.description}>{page.description}</p>
      </div>
    </Link>
  );
}
