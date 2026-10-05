import { getDictionary } from "@/lib/i18n";
import { bold } from "@/lib/render";

const headingClasses =
    "font-display text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100";
const bodyClasses = "mt-3 text-lg text-zinc-800 dark:text-zinc-100";

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
                    <p className={bodyClasses}>
                        {bold(t.introductionText)}
                    </p>
                </section>

                <section aria-labelledby="proud-of-heading" className="mt-10">
                    <h2 id="proud-of-heading" className={headingClasses}>
                        {t.proudOf}
                    </h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-zinc-800 dark:text-zinc-100">
                        {t.proudOfText.map((text, i) => (
                            <li key={i}>
                                {text}
                            </li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="skills-heading" className="mt-10">
                    <h2 id="skills-heading" className={headingClasses}>
                        {t.skills}
                    </h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-zinc-800 dark:text-zinc-100">
                        {t.skillsList.map((skill, i) => (
                            <li key={i}>{skill}</li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="experience-heading" className="mt-10">
                    <h2 id="experience-heading" className={headingClasses}>
                        {t.experience}
                    </h2>
                    <ol className="mt-3 space-y-6 text-lg text-zinc-800 dark:text-zinc-100">
                        {t.experienceList.map((job, i) => (
                            <li key={i}>
                                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                                    <span className="font-semibold">
                                        {job.role}, {job.company}
                                    </span>
                                    <span className="text-base text-zinc-500 dark:text-zinc-400">
                                        {job.period}
                                    </span>
                                </div>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                    {job.details.map((detail, j) => (
                                        <li key={j}>{detail}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ol>
                </section>

                <section aria-labelledby="education-heading" className="mt-10">
                    <h2 id="education-heading" className={headingClasses}>
                        {t.education}
                    </h2>
                    <ol className="mt-3 space-y-2 text-lg text-zinc-800 dark:text-zinc-100">
                        {t.educationList.map((edu, i) => (
                            <li key={i}>
                                <span className="font-semibold">{edu.degree}</span>,{" "}
                                {edu.school}, {edu.location} · {edu.period}
                            </li>
                        ))}
                    </ol>
                </section>

                <section aria-labelledby="languages-heading" className="mt-10">
                    <h2 id="languages-heading" className={headingClasses}>
                        {t.languages}
                    </h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-lg text-zinc-800 dark:text-zinc-100">
                        {t.languagesList.map((lang, i) => (
                            <li key={i}>
                                {lang.name} ({lang.level})
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </section>
    );
}
