import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export const PREVIEW_LENGTH = 200;

export function stripMarkdown(text: string): string {
  let result = text;

  result = result.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  result = result.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  result = result.replace(/```[\s\S]*?```/g, "");
  result = result.replace(/`([^`]*)`/g, "$1");

  result = result.replace(/^\s{0,3}>\s?/gm, "");
  result = result.replace(/^\s*([-*_])\s*(?:\1\s*){2,}$/gm, "");
  result = result.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  result = result.replace(/^\s*[-*+]\s+/gm, "");
  result = result.replace(/^\s*\d+\.\s+/gm, "");
  result = result.replace(/(\*\*|__)(.*?)\1/g, "$2");
  result = result.replace(/(\*|_)(.*?)\1/g, "$2");
  result = result.replace(/~~(.*?)~~/g, "$1");

  return result.replace(/\s+/g, " ").trim();
}

export function makePreview(
  content: string,
  maxChars: number = PREVIEW_LENGTH,
): string {
  const text = stripMarkdown(content);
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "…";
}

export function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const title = data.title != null ? String(data.title) : slug;
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : data.date != null
        ? String(data.date)
        : "";
  const summary = data.summary != null ? String(data.summary) : undefined;

  return {
    slug,
    title,
    date,
    ...(summary ? { summary } : {}),
    content,
  };
}
