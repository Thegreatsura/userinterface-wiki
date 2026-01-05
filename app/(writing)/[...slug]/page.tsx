import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article, toSerializablePageData } from "@/components/article";
import { Narration } from "@/components/narration";
import { PageTransition } from "@/components/page-transition";
import { formatPageData, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import styles from "./styles.module.css";

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const slugPath = params.slug.join("/");
  const ogImageUrl = `/api/og?slug=${encodeURIComponent(slugPath)}`;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [ogImageUrl],
    },
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  const { author, coauthors } = formatPageData(page.data);

  const pageData = toSerializablePageData(page);

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.spacer} />
        <Article.Root
          data={pageData}
          author={author}
          coauthors={coauthors}
          className={styles.article}
        >
          <Narration.Provider
            slug={pageData.slugs.join("/")}
            title={pageData.data.title}
            authorName={author.name}
          >
            <Article.Header />
            <Article.Content>
              <MDX components={getMDXComponents()} />
            </Article.Content>
            <Narration.Player />
          </Narration.Provider>
        </Article.Root>
      </div>
    </PageTransition>
  );
}
