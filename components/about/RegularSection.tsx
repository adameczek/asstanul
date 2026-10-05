import { getDictionary } from "@/lib/i18n";

export default async function RegularSection() {
  const dict = await getDictionary();

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
          {dict.about.heading}
        </h1>
        <p className="mt-6 text-lg">{dict.about.todo}</p>
      </div>
    </section>
  );
}
