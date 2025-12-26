import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(".");
const iconsRoot = path.join(repoRoot, "icons");

const skipDirs = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "out",
  "public",
  "scripts",
]);

const exts = [".ts", ".tsx", ".mdx", ".js", ".jsx", ".json", ".md"];

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
};

const listIcons = async () => {
  const files = await walk(iconsRoot);
  const icons = [];
  for (const file of files) {
    if (!file.endsWith(".tsx")) continue;
    if (path.basename(file) === "index.ts") continue;
    const content = await fs.readFile(file, "utf8");
    const match = content.match(/export const\s+(\w+)/);
    if (!match) continue;
    icons.push({ name: match[1], file });
  }
  return icons;
};

const loadTargets = async () => {
  const files = await walk(repoRoot);
  return files.filter(
    (file) =>
      exts.some((ext) => file.endsWith(ext)) && !file.startsWith(iconsRoot),
  );
};

const hasUsage = (content, symbol) => new RegExp(`\b${symbol}\b`).test(content);

const main = async () => {
  const icons = await listIcons();
  const targets = await loadTargets();

  const cache = new Map();
  const readFile = async (file) => {
    if (cache.has(file)) return cache.get(file);
    const text = await fs.readFile(file, "utf8");
    cache.set(file, text);
    return text;
  };

  const unused = [];
  for (const icon of icons) {
    let used = false;
    for (const file of targets) {
      const text = await readFile(file);
      if (hasUsage(text, icon.name)) {
        used = true;
        break;
      }
    }
    if (!used) unused.push(icon);
  }

  if (process.argv.includes("--delete")) {
    for (const icon of unused) {
      await fs.unlink(icon.file);
    }
    console.log(`Deleted ${unused.length} unused icons.`);
    return;
  }

  if (!unused.length) {
    console.log("No unused icons found.");
    return;
  }

  console.log("Unused icons (not referenced outside icons/):\n");
  for (const icon of unused) {
    console.log(`${icon.name} -> ${path.relative(repoRoot, icon.file)}`);
  }
  console.log(
    `\nFound ${unused.length} unused icons. Re-run with --delete to remove them.`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
