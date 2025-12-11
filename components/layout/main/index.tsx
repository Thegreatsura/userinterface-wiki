import styles from "./styles.module.css";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <main className={styles.main}>{children}</main>;
};
