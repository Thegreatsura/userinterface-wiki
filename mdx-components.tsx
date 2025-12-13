import type { MDXComponents } from "mdx/types";
import { Principles } from "@/documents/12-principles";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...Principles,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
