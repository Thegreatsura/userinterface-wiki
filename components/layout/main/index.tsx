import styles from "./styles.module.css";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.main}>{children}</div>;
};
