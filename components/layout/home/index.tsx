import { Suspense } from "react";
import { Search, type SerializedPage } from "@/components/layout/home/search";
import { PageTransition } from "@/components/page-transition";
import { getFormattedPageFromPageSource } from "@/markdown/functions/get-page";
import { source } from "@/markdown/lib/source";
import styles from "./index.module.css";

function serializePages(): SerializedPage[] {
  const pages = source.getPages();

  return pages.map((page) => {
    const formatted = getFormattedPageFromPageSource(page);
    return {
      url: page.url,
      title: formatted.title,
      description: formatted.description,
      tags: formatted.tags,
      author: {
        name: formatted.author.name,
      },
      date: {
        published: formatted.date.published,
      },
    };
  });
}

function extractUniqueTags(pages: SerializedPage[]): string[] {
  const tagSet = new Set<string>();
  for (const page of pages) {
    for (const tag of page.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function HomeLayout() {
  const pages = serializePages();
  const tags = extractUniqueTags(pages);

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces</h1>
      </div>

      <div className={styles.container}>
        <Suspense fallback={null}>
          <Search pages={pages} tags={tags} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
