import fs from "node:fs";
import path from "node:path";
import { makePreview, parsePost, type Post, type PostMeta } from "./blog";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostPreview extends PostMeta {
  preview: string;
}

function readPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      return parsePost(slug, raw);
    })
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return a.title.localeCompare(b.title);
    });
}

export function getAllPosts(): PostPreview[] {
  return readPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    ...(post.summary ? { summary: post.summary } : {}),
    preview: post.summary ?? makePreview(post.content),
  }));
}

export function getPostBySlug(slug: string): Post | undefined {
  return readPosts().find((post) => post.slug === slug);
}
