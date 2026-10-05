import { getDictionary } from "@/lib/i18n";

export default async function Gallery() {
  const dict = await getDictionary();

  return (
    <>
      <h1>{dict.pages.gallery}</h1>
      <p>{dict.pages.todo}</p>
    </>
  );
}
