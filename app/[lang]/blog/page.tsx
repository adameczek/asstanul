import { getDictionary } from "@/lib/i18n";

export default async function Blog() {
  const dict = await getDictionary();

  return (
    <>
      <h1>{dict.pages.blog}</h1>
      <p>{dict.pages.todo}</p>
    </>
  );
}
