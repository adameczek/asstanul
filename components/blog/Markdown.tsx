import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: (props) => (
    <h1 className="mt-10 mb-4 font-display text-3xl text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-8 mb-3 font-display text-2xl text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 font-display text-xl text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  h4: (props) => (
    <h4 className="mt-6 mb-2 font-display text-lg text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  h5: (props) => (
    <h5 className="mt-4 mb-2 font-display text-base text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  h6: (props) => (
    <h6 className="mt-4 mb-2 font-display text-sm text-zinc-800 dark:text-zinc-100" {...props} />
  ),
  p: (props) => <p className="mb-4 text-zinc-700 dark:text-zinc-300" {...props} />,
  a: (props) => (
    <a className="underline decoration-2 underline-offset-4 hover:opacity-70" {...props} />
  ),
  ul: (props) => <ul className="mb-4 list-disc pl-6" {...props} />,
  ol: (props) => <ol className="mb-4 list-decimal pl-6" {...props} />,
  li: (props) => <li className="text-zinc-700 dark:text-zinc-300" {...props} />,
  blockquote: (props) => (
    <blockquote className="mb-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-500 dark:border-zinc-700" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800" {...props} />
  ),
  pre: (props) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm dark:bg-zinc-800" {...props} />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em {...props} />,
  hr: (props) => <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />,
  img: ({ src, alt }) => (
    <span className="relative mb-4 block aspect-video w-full overflow-hidden rounded-lg">
      <Image
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="object-contain"
      />
    </span>
  ),
  table: (props) => <table className="mb-4 w-full border-collapse text-sm" {...props} />,
  th: (props) => (
    <th className="border border-zinc-300 px-3 py-2 text-left font-semibold dark:border-zinc-700" {...props} />
  ),
  td: (props) => (
    <td className="border border-zinc-300 px-3 py-2 dark:border-zinc-700" {...props} />
  ),
};

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
