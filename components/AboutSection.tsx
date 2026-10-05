import RecruiterSection from "./about/RecruiterSection";
import { getDictionary } from "@/lib/i18n";

export default async function AboutSection() {
  const dict = await getDictionary();

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="pt-10 font-display text-4xl font-bold tracking-tight md:text-6xl">
          {dict.about.heading}
        </h1>
      </div>
      <RecruiterSection />
    </>
  );
}
