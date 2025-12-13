import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import type { Author } from "@/lib/types";
import { schema } from "./schema";

const directory = join(dirname(fileURLToPath(import.meta.url)), "data");

const registry = new Map<string, Author>();

export const authors = readdirSync(directory)
  .filter((filename) => filename.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b))
  .map((filename) => {
    const absolutePath = join(directory, filename);
    const relativePath = relative(process.cwd(), absolutePath);

    let definition: unknown;

    try {
      const contents = readFileSync(absolutePath, "utf8");
      definition = JSON.parse(contents);
    } catch (error) {
      throw new Error(
        `Unable to read author file ${relativePath}: ${(error as Error).message}`,
      );
    }

    const result = schema.safeParse(definition);

    if (!result.success) {
      throw new Error(
        `Invalid author definition in ${relativePath}: ${result.error.message}`,
      );
    }

    return result.data;
  })
  .map((author) => {
    if (registry.has(author.id)) {
      throw new Error(`Duplicate author id: ${author.id}`);
    }

    registry.set(author.id, author);

    return author;
  });

export function getAuthorById(id: string): Author {
  const author = registry.get(id);

  if (!author) {
    throw new Error(`Author not found: ${id}`);
  }

  return author;
}
