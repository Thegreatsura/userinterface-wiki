export function Figure({ ...props }: React.HTMLAttributes<HTMLElement>) {
  return <figure data-prose-type="figure" {...props} />;
}

export function Caption({ ...props }: React.HTMLAttributes<HTMLElement>) {
  return <figcaption data-prose-type="figcaption" {...props} />;
}
