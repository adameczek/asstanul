import Link from "next/link";
import { lang } from "next/root-params";
import { getAllPosts } from "@/lib/blogData";
import { getDictionary } from "@/lib/i18n";

export default async function Blog() {
  const dict = await getDictionary();
  const locale = await lang();
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
      <h1 className="font-display text-4xl text-zinc-800 dark:text-zinc-100">
        {dict.pages.blog}
      </h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-zinc-500 dark:text-zinc-400">No posts yet.</p>
      ) : (
        <ul className="mt-10 flex flex-col gap-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group block"
              >
                <h2 className="font-display text-2xl text-zinc-800 underline-offset-8 group-hover:underline dark:text-zinc-100">
                  {post.title}
                </h2>
                {post.date && (
                  <time className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
                    {post.date}
                  </time>
                )}
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                  {post.preview}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
