import Link from "next/link";
import styles from "./error.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--gray-1)",
              backgroundColor: "var(--gray-12)",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
