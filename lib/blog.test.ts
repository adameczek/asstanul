import { describe, expect, it } from "vitest";
import { makePreview, parsePost, stripMarkdown } from "./blog";

describe("stripMarkdown", () => {
  it("removes headings", () => {
    expect(stripMarkdown("# Hello")).toBe("Hello");
  });

  it("removes bold and italic markers", () => {
    expect(stripMarkdown("**bold** and *italic*")).toBe("bold and italic");
  });

  it("keeps link text and drops the url", () => {
    expect(stripMarkdown("[click here](https://example.com)")).toBe(
      "click here",
    );
  });

  it("keeps image alt text and drops the url", () => {
    expect(stripMarkdown("![a picture](/img.png)")).toBe("a picture");
  });

  it("removes blockquote and list markers", () => {
    expect(stripMarkdown("> quote\n\n- item")).toBe("quote item");
  });

  it("removes inline code backticks", () => {
    expect(stripMarkdown("`const x = 1`")).toBe("const x = 1");
  });

  it("collapses whitespace and newlines", () => {
    expect(stripMarkdown("a\n\nb\tc")).toBe("a b c");
  });
});

describe("makePreview", () => {
  it("returns short content unchanged with no ellipsis", () => {
    expect(makePreview("short text", 100)).toBe("short text");
  });

  it("truncates long content to the given length and appends an ellipsis", () => {
    expect(makePreview("a".repeat(300), 200)).toBe("a".repeat(200) + "…");
  });

  it("strips markdown before truncating", () => {
    expect(makePreview("# Title", 100)).toBe("Title");
  });
});

describe("parsePost", () => {
  it("parses title, date, and summary from frontmatter", () => {
    const post = parsePost(
      "hello",
      '---\ntitle: Hello\ndate: "2026-10-05"\nsummary: A summary\n---\nBody',
    );
    expect(post).toEqual({
      slug: "hello",
      title: "Hello",
      date: "2026-10-05",
      summary: "A summary",
      content: "Body",
    });
  });

  it("falls back to the slug when title is missing", () => {
    const post = parsePost("hello", '---\ndate: "2026-10-05"\n---\nBody');
    expect(post.title).toBe("hello");
  });

  it("handles a file without frontmatter", () => {
    const post = parsePost("hello", "Just content");
    expect(post).toEqual({
      slug: "hello",
      title: "hello",
      date: "",
      content: "Just content",
    });
  });
});
