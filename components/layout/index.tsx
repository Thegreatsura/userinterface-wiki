import styles from "./styles.module.css";

export const Article = ({ children }: { children: React.ReactNode }) => {
  return <article className={styles.article}>{children}</article>;
};

export const Main = ({ children }: { children: React.ReactNode }) => {
  return <main className={styles.main}>{children}</main>;
};

interface RootProps {
  children: React.ReactNode;
  id?: string;
}

export const Root = ({ children, id }: RootProps) => {
  return (
    <div className={styles.root} id={id}>
      {children}
    </div>
  );
};
