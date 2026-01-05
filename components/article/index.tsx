"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import type { Author } from "@/lib/authors";
import { getGradientColors } from "@/lib/colors";
import styles from "./styles.module.css";
import type { SerializablePageData } from "./utils";

export type { SerializablePageData } from "./utils";
export { toSerializablePageData } from "./utils";

export interface ArticleContextValue {
  page: SerializablePageData;
  author: Author;
  coauthors: Author[];
  colors: [string, string];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const ArticleContext = createContext<ArticleContextValue | null>(null);

function useArticleContext(componentName: string): ArticleContextValue {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error(
      `<Article.${componentName}> must be used within <Article.Root>`,
    );
  }
  return context;
}

export function useArticle(): ArticleContextValue {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticle must be used within <Article.Root>");
  }
  return context;
}

interface RootProps {
  data: SerializablePageData;
  author: Author;
  coauthors?: Author[];
  children: React.ReactNode;
  className?: string;
}

function Root({
  data: page,
  author,
  coauthors = [],
  children,
  className,
}: RootProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const colors = useMemo(
    () => getGradientColors(page.slugs?.join("-") ?? ""),
    [page.slugs],
  );

  const contextValue: ArticleContextValue = useMemo(
    () => ({
      page,
      colors,
      author,
      coauthors,
    }),
    [page, colors, author, coauthors],
  );

  return (
    <ArticleContext.Provider value={contextValue}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </ArticleContext.Provider>
  );
}

interface HeaderProps {
  className?: string;
}

function Header({ className }: HeaderProps) {
  const { page, author, coauthors } = useArticleContext("Header");

  const hasCoauthors = coauthors.length > 0;

  return (
    <header className={className ?? styles.header}>
      <h1 className={styles.title}>{page.data.title}</h1>
      <div className={styles.metadata}>
        {formatDate(page.data.date.published)}&nbsp;by&nbsp;
        {author.name}
        {hasCoauthors && <span>&nbsp;and {coauthors.length} others</span>}
      </div>
    </header>
  );
}

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}

function Content({ children, className }: ContentProps) {
  return <article className={className}>{children}</article>;
}

export const Article = {
  Root,
  Header,
  Content,
};
