// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "markdown/content",
  docs: {},
  meta: {}
});
var source_config_default = defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    rehypeCodeOptions: {
      themes: {
        light: "light-plus",
        dark: "slack-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs
};
