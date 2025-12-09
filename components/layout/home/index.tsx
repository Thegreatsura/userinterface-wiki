import { Field } from "@base-ui-components/react/field";
import { clsx } from "clsx";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/button";
import { SearchIcon } from "@/components/icons/search";
import { source } from "@/markdown/lib/source";
import styles from "./styles.module.css";

export const HomeLayout = () => {
  return (
    <React.Fragment>
      <div className={styles.header}>
        <h1 className={styles.title}>
          The Open Source Wiki for User Interfaces
        </h1>
      </div>

      <div className={styles.posts}>
        <div className={styles.menu}>
          <div className={styles.filters}>
            <Button className={clsx(styles.button)} variant="text">
              All
            </Button>
            <Button className={clsx(styles.button)} variant="text">
              Trending
            </Button>
            <Button className={clsx(styles.button)} variant="text">
              Recents
            </Button>
            <Button className={clsx(styles.button)} variant="text">
              Saved
            </Button>
          </div>

          <Field.Root className={styles.search}>
            <SearchIcon className={styles.icon} size={18} />
            <Field.Control
              required
              placeholder="Search..."
              className={styles.input}
            />
          </Field.Root>
        </div>
        <div className={styles.grid}>
          {source.getPages().map((page) => {
            const { url, data } = page;
            const {
              title,
              author,
              date: { published },
            } = data;

            console.log(page);

            return (
              <Link key={url} href={url} className={styles.card}>
                <h2 className={styles.cardTitle}>{title}</h2>
                <p className={styles.cardMeta}>
                  {author} - {published}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};
