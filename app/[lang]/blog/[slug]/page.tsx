import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import Markdown from "@/components/blog/Markdown";
import { getAllPosts, getPostBySlug } from "@/lib/blogData";
import { getDictionary } from "@/lib/i18n";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post ? post.title : "Blog" };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const locale = await lang();
  const dict = await getDictionary();
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
      <Link
        href={`/${locale}/blog`}
        className="text-sm text-zinc-500 hover:opacity-70 dark:text-zinc-400"
      >
        ← {dict.pages.blog}
      </Link>

      <article className="mt-6">
        <h1 className="font-display text-4xl text-zinc-800 dark:text-zinc-100">
          {post.title}
        </h1>
        {post.date && (
          <time className="mt-2 block text-sm text-zinc-500 dark:text-zinc-400">
            {post.date}
          </time>
        )}
        <div className="mt-8">
          <Markdown content={post.content} />
        </div>
      </article>
    </main>
  );
}
