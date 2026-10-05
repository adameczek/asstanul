import { getDictionary } from "@/lib/i18n";

const headingClasses =
  "font-display text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100";

export default async function RecruiterSection() {
  const dict = await getDictionary();
  const t = dict.about;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="max-w-3xl">
        <section aria-labelledby="introduction-heading" className="mt-10">
          <h2 id="introduction-heading" className={headingClasses}>
            {t.introduction}
          </h2>
          <p className="mt-3 text-lg text-zinc-800 dark:text-zinc-100">
            {t.todo}
          </p>
        </section>

        <section aria-labelledby="proud-of-heading" className="mt-10">
          <h2 id="proud-of-heading" className={headingClasses}>
            {t.proudOf}
          </h2>
          <p className="mt-3 text-lg text-zinc-800 dark:text-zinc-100">
            {t.todo}
          </p>
        </section>

        <section aria-labelledby="skills-heading" className="mt-10">
          <h2 id="skills-heading" className={headingClasses}>
            {t.skills}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-zinc-800 dark:text-zinc-100">
            <li>{t.todo}</li>
          </ul>
        </section>

        <section aria-labelledby="experience-heading" className="mt-10">
          <h2 id="experience-heading" className={headingClasses}>
            {t.experience}
          </h2>
          <ol className="mt-3 space-y-2 text-lg text-zinc-800 dark:text-zinc-100">
            <li>{t.todo}</li>
          </ol>
        </section>

        <section aria-labelledby="education-heading" className="mt-10">
          <h2 id="education-heading" className={headingClasses}>
            {t.education}
          </h2>
          <ol className="mt-3 space-y-2 text-lg text-zinc-800 dark:text-zinc-100">
            <li>{t.todo}</li>
          </ol>
        </section>

        <section aria-labelledby="languages-heading" className="mt-10">
          <h2 id="languages-heading" className={headingClasses}>
            {t.languages}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-zinc-800 dark:text-zinc-100">
            <li>{t.todo}</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
