import Link from "next/link";
import type { Page } from "@/lib/types";
import { Code } from "../icons";
import styles from "./styles.module.css";

export function PageCard({ page }: { page: Page }) {
  return (
    <Link href={{ pathname: page.url }} className={styles.post}>
      <div className={styles.details}>
        <div className={styles.preview}>
          <Code />
        </div>
        <div>
          <h2 className={styles.title}>{page.data.title}</h2>
          <span className={styles.meta}>
            <span>{page.data.author}</span>
            <span className={styles.separator} />
            <span>{page.data.date.published}</span>
          </span>
        </div>
      </div>
      <div>
        <p className={styles.description}>{page.data.description}</p>
      </div>
    </Link>
  );
}
