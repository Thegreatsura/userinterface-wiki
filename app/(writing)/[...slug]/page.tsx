import { ViewTransition } from "react";
import { Footer } from "@markdown/components/footer";
import { Header } from "@markdown/components/header";
import { source } from "@markdown/lib/source";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudioReader } from "@/components/audio-reader";
import { Article } from "@/components/layout";
import { ViewTracker } from "@/components/view-tracker";
import { getViews } from "@/lib/views";

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;

  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;
  const slugString = params.slug.join("/");
  const views = await getViews(slugString);

  return (
    <ViewTransition>
      <ViewTracker slug={slugString} />
      <Header page={page} views={views} />
      <Article>
        <AudioReader slugSegments={params.slug} />
        <MDX />
      </Article>
      <Footer page={page} />
    </ViewTransition>
  );
}
