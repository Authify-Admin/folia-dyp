import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { GuideArticle } from "@/components/learn/GuideArticle";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = guideBySlug(params.slug);
  if (!guide) return { title: "Guide not found" };
  return { title: guide.title, description: guide.dek };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();
  return <GuideArticle slug={params.slug} />;
}
